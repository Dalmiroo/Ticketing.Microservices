import mongoose from "mongoose";
import express, {Request, Response } from "express";
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@dsfticketing/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { natsWrapper } from "../nats-wrapper";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";

const router = express.Router();

const EXPIRATION_WINDOWS_SECONDS = 15 * 60;

router.post('/api/orders', requireAuth, [
   body('ticketId')
   .not()
   .isEmpty()
   .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
   .withMessage('ticketid must be provided')
], validateRequest, 
 async (req: Request, res: Response) => {
   const {ticketId} = req.body;
   //Find the ticket the user is trying to order in the db
   const ticket = await Ticket.findById(ticketId);
   if(!ticket) {
   
      throw new NotFoundError();
      
   }

   //make sure that the ticket isnt already reserved
   //run query to look to all orders. Find and order where the ticket is
   //the ticket we just fetched *and* the orders status is *not* cancelled
   //if we find an order from that means the ticket *is* reserved
   const isReserved = await ticket.isReserved();

   if(isReserved) {
      throw new BadRequestError('ticket is already reserved');
   }

   //calculate expiration date for the order
   const expiration = new Date();
   expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOWS_SECONDS);

   //build the order and save it to the db
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: ticket
    })
    await order.save();

   //publish an event saying that an order was created
   new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      version: order.version,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      // returns us a string that give us the date thats contained inside th expiresAt object and give a UTC time zone
      ticket: {
         id: ticket.id,
         price: ticket.price
      }
   })

     res.status(201).send(order);

})


export {router as newOrderRouter};