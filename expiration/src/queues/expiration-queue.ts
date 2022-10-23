import Queue from "bull";
import {ExpirationCompletePublisher} from '../events/publishers/expiration-completed-publisher'
import {natsWrapper} from '../nats-wrapper'

//describes the payload stored inside the job object
interface Payload {
  orderId: string;
}


const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST
  }
});

//receive a job
expirationQueue.process( async (job) => {
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId
  })
  
})

export { expirationQueue };