import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import mongoose from 'mongoose'
import {OrderStatus, ExpirationCompleteEvent} from '@dsfticketing/common'
import { Message } from "node-nats-streaming";

const setup = async() => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);
  

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'DON TOLIVER',
    price: 420
  })
 await ticket.save()

 const order = Order.build({
    status: OrderStatus.Created,
    userId: 'asdasdasdas',
    expiresAt: new Date(),
    ticket: ticket
 })

 await order.save()


 const data: ExpirationCompleteEvent['data'] = {
  orderId: order.id
 }

 // @ts-ignore
 const msg: Message = {
   ack: jest.fn()
 }

 return {order,listener,data,ticket,msg}
}


it('updates the order status to cancelled', async() =>{ 
   const {listener,order,data,ticket,msg } = await setup();

   await listener.onMessage(data,msg);

   const updatedOrder = await Order.findById(order.id);

   expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emits an orderCancelled event', async() =>{ 
  const {listener,order,data,ticket,msg } = await setup();

  await listener.onMessage(data,msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

  expect(eventData.id).toEqual(order.id);
})

it('ack the msg', async() =>{ 
  const {listener, data, msg } = await setup();

  await listener.onMessage(data,msg);

  expect(msg.ack).toHaveBeenCalled();
})
