import nats from 'node-nats-streaming';
import {TicketCreatedPublisher } from './events/ticket-created-publisher'

console.clear();
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {

  console.log('publisher connected to NATS')

  const publisher = new TicketCreatedPublisher(stan);
try {
  await publisher.publish({
    id: '123',
    title: 'concert',
    price: 30
 })
} catch (error) {
  console.error(error);
}
 
  // const data = JSON.stringify({
  //   id: '123', 
  //   title: 'concert',
  //   price: 20
  // });

  // //publish to nats server
  // stan.publish('ticket:created', data, () => {
  //   console.log('event published')
  // })
})

