import { Publisher, Subjects, TicketCreatedEvent } from "@dsfticketing/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
     subject: Subjects.TicketCreated = Subjects.TicketCreated;


}
