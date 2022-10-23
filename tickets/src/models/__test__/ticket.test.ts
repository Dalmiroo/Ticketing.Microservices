import { Ticket } from "../ticket";

it('implements optimistic concurrency control', async () => {
   //create instace of a ticket
   const ticket = Ticket.build({
    title: 'RAGEEEE',
    price: 200,
    userId: '123'
   })

   //save ticket to db 
  await ticket.save();

   //fetch the ticket twice
   const firstInstance = await Ticket.findById(ticket.id);
   const secondInstance = await Ticket.findById(ticket.id);

   //make 2 separate changes to the tickets we fetched
   firstInstance!.set({price: 1000});
   secondInstance!.set({price: 30000})

   //save the first fetched ticket
   await firstInstance!.save();


   //save the second fetched ticket and expect an error

   try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error('should not reach this point')
})

it('increments the version number on multiple saves', async() => {
   const ticket = Ticket.build({
    title: 'concert',
    price: 420,
    userId:'asdasd'
   })

   await ticket.save();
   expect(ticket.version).toEqual(0);
   await ticket.save();
   expect(ticket.version).toEqual(1);
   await ticket.save();
   expect(ticket.version).toEqual(2);
})