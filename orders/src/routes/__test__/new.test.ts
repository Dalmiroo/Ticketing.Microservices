import request from 'supertest'
import {app} from '../../app';
import mongoose from 'mongoose';
import {Order, OrderStatus} from '../../models/order'
import {Ticket} from '../../models/ticket';
import {natsWrapper} from '../../nats-wrapper';


it('return an error if the ticket doesnt exist', async () => {
   const ticketId = new mongoose.Types.ObjectId();

    await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
      ticketId: ticketId
    })
    .expect(400)
})

it('returns an error if the ticket is already reserved', async () => {
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'TRAVIS SCOTT RAGEEEE',
      price: 3500
    })
   await ticket.save();

   const order = Order.build({
    ticket: ticket,
    userId: 'asdasdass',
    status: OrderStatus.Created,
    expiresAt: new Date()
   })

   await order.save();

   await request(app)
   .post('/api/orders')
   .set('Cookie', global.signin())
   .send({ticketId: ticket.id}) 
   .expect(400);
})

it('reserves a ticket', async () => {
 
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'TRAVIS SCOTT RAGE',
    price: 3500
  })
 await ticket.save()

  await request(app)
  .post('/api/orders')
  .set('Cookie', global.signin())
  .send({ ticketId: ticket.id})
  .expect(201)
})

it('emits an order created event', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'TRAVIS SCOTT RAGE',
    price: 3500
  })
 await ticket.save()

  await request(app)
  .post('/api/orders')
  .set('Cookie', global.signin())
  .send({ ticketId: ticket.id})
  .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})