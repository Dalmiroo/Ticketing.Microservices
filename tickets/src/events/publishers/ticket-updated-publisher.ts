import { Publisher, Subjects, TicketUpdatedEvent } from "@dsfticketing/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
     subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
