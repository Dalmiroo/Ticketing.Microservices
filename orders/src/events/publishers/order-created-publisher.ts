import { Publisher, OrderCreatedEvent, Subjects } from "@dsfticketing/common";


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    
}