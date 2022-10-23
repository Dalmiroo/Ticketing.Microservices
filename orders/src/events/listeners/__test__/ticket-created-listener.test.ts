import { TicketCreatedListener } from "../ticket-created-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketCreatedEvent } from "@dsfticketing/common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/ticket"

const setup = async() => {

//create an instance of the listener

  const  listener = new TicketCreatedListener(natsWrapper.client)


   //create fake data event

   const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'TRAVVVVVVV',
    price: 12000,
    userId: new mongoose.Types.ObjectId().toHexString()
   }

   //create fake message object
   // @ts-ignore
   const msg: Message = {
    ack: jest.fn()
   }

   return {data, listener, msg}
}

it('creates and saves a ticket', async() => {
   const {data, listener, msg} = await setup(); 

   //call the onmsg function with the  data object + msg object
   await listener.onMessage(data, msg);

   //write assertions to make sure a ticket was created!
   const ticket = await Ticket.findById(data.id);

   expect(ticket).toBeDefined()
   expect(ticket!.title).toEqual(data.title);
   expect(ticket!.price).toEqual(data.price)


})

it('acks the message', async() => {
  const {data, listener, msg} = await setup();

   //call the onmsg function with the  data object + msg object
    await listener.onMessage(data, msg);

   //write assestions to make sure ack function is called
   expect(msg.ack).toHaveBeenCalled();
})