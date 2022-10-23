import express, { Request, Response} from 'express'
import { body } from 'express-validator'
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  BadRequestError
} from '@dsfticketing/common'
import { Ticket } from '../models/ticket'
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router();

router.put('/api/tickets/:id', requireAuth, [
    body('title')
    .not()
    .isEmpty()
    .withMessage('title is required'),

    body('price')
    .isFloat({gt: 0})
    .withMessage('price must be provided and must be greater than 0')
     
  

], validateRequest, async(req: Request, res: Response) => {
   const ticket = await Ticket.findById(req.params.id);

   if(!ticket) {
    throw new NotFoundError();
   }

   if(ticket.orderId) {
    throw new BadRequestError('ticket is reserved, cannot edit');
   }

    if(ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    

    ticket.set({
      title: req.body.title,
      price: req.body.price
    })

    //after settin some new properties on the ticket, that just makes updates to the document in memory

    await ticket.save();
    
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version
    })


    res.send(ticket);
})

export {router as updateTicketRouter}