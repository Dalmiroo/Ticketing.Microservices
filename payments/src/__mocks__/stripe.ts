export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({})
    //mockResolvedValue: make sure that whenever we call the create function,  we are gonna take back a promise that
    //automatically resolves itself with an empty object
    
  }
}