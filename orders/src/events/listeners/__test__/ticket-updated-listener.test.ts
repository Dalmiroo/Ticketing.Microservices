import mongoose from "mongoose"
import { TicketUpdatedEvent } from "@dsfticketing/common"
import { TicketUpdatedListener } from "../ticket-updated-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket"
import { Message } from "node-nats-streaming"

const setup = async () => {
  //create a listener
const listener = new TicketUpdatedListener(natsWrapper.client)

  //create  and save a ticket

   const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 200
   })
   await ticket.save();

   //create a fake data object
   const data: TicketUpdatedEvent['data'] = {
     id: ticket.id,
     version: ticket.version + 1,
     title: 'new concert',
     price: 666,
     userId: 'asdasdassasa'
   }  

   //create a fake msg object
   // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }
  //return all stuff

  return {data, listener, ticket,  msg}
}


it('finds updates and saves a ticket', async() => {
   const {data, listener, ticket, msg} = await setup();

   await listener.onMessage(data, msg);

   const updatedTicket = await Ticket.findById(ticket.id);


   expect(updatedTicket!.title).toEqual(data.title)
   expect(updatedTicket!.price).toEqual(data.price)
   expect(updatedTicket!.version).toEqual(data.version)
})


it('acks msg', async() => {
  const {data, listener, msg} = await setup()

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
})


it('doesnt call ack if the event has a skipped  version number', async() => {
  const {msg, data, listener, ticket} = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data,msg);
  } catch (error) {

  }

  expect(msg.ack).not.toHaveBeenCalled();

})