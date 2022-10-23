import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"
import { OrderCreatedEvent, OrderStatus } from "@dsfticketing/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async() => {
  //create instance of listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  //create and save a ticket

  const ticket = Ticket.build({
    title: 'ANUELAA',
    price: 99,
    userId: 'dsfff'
  })
  await ticket.save();

  //fake data object
const data: OrderCreatedEvent['data'] = {
  id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'dsffff',
    expiresAt: 'fasdasdsa',
    ticket: {
        id: ticket.id,
        price: ticket.price
}
}

// @ts-ignore
 const msg: Message  = {
  ack: jest.fn()
 }

 return {msg, listener, data, ticket};

}

it('sets the userid of the ticket', async () => {
  const {listener, ticket,data, msg} = await setup();

  await listener.onMessage(data,msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id); //id of the order just created

})

it('acks the msg', async () => {
  const {listener, ticket,data, msg} = await setup();
  
  await listener.onMessage(data,msg);

  expect(msg.ack).toHaveBeenCalled();
})


it('publishes a ticket updated event', async() => {
  const {listener, ticket,data, msg} = await setup();

  await listener.onMessage(data,msg);


  expect(natsWrapper.client.publish).toHaveBeenCalled();

  
  const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

   expect(data.id).toEqual(ticketUpdatedData.orderId);
  
})