import request from 'supertest'
import {app } from '../../app'
import { Order } from '../../models/order'
import { Ticket } from '../../models/ticket'
import mongoose from 'mongoose'

const buildTicket = async () =>{
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'travisss rage',
    price: 90210
  })

  await ticket.save()

  return ticket;
}

it('fetches orders for a particular user', async() => {
  //create 3 tickets
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const user1 = global.signin();
  const user2 = global.signin();
  //create an order as user 1
  await request(app)
  .post('/api/orders')
  .set('Cookie', user1)
  .send({ticketId: ticketOne.id})
  .expect(201);



  //create two order as user 2
const {body: orderOne} = await request(app)
  .post('/api/orders')
  .set('Cookie', user2)
  .send({ticketId: ticketTwo.id})
  .expect(201);

 const {body: orderTwo} = await request(app)
  .post('/api/orders')
  .set('Cookie', user2)
  .send( {ticketId: ticketThree.id} )
  .expect(201)

  //make request to get order for user 2
  const response = await request(app)
  .get('/api/orders')
  .set('Cookie', user2)
  .expect(200)


  //make sure we only got  the orders for user 2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].ticket.id).toEqual(ticketTwo.id)
  expect(response.body[1].ticket.id).toEqual(ticketThree.id)

})

