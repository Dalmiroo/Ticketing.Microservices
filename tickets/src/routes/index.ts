import express, { Request, Response} from 'express'
import { OrderCreatedListener } from '../events/listeners/order-created-listener';
import { Ticket } from '../models/ticket'

const router = express.Router()

router.get('/api/tickets', async (req: Request, res: Response) => {

  const tickets = await Ticket.find({
    orderId: undefined  
  }); //all the tickets NOT RESERVED
  
  res.send(tickets);

})
OrderCreatedListener;    


export {router as indexTicketRouter}