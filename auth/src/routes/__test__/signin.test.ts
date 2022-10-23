import request from "supertest";

import { app } from "../../app";


it('fails when an email that not exist is supplied', async () =>{
  await request(app)
  .post('/api/users/signin')
  .send({
    email: 'dalmiro@gmail.com',
    password: 'asmdasmdsa'
  })
 .expect(400)
})
  it('fails when a incorrect password is supplied', async () => {
     await request(app) 
     .post('/api/users/signup')
     .send({
      email: 'dalmiro@gmail.com',
      password: 'asdasdasda'
     })
    .expect(201);


    await request(app)
    .post('/api/users/signin')
    .send({
      email: 'dalmiro@gmail.com',
      password: 'asdasodakasdasdas'
    })
    .expect(400);   
      
  })


   it('response with a cookie when valid credentials', async() =>{
    await request(app) 
     .post('/api/users/signup')
     .send({
      email: 'dalmiro@gmail.com',
      password: 'password'
     })
    .expect(201);


   const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'dalmiro@gmail.com',
      password: 'password'
    })
    .expect(200);  

    expect(response.get('Set-Cookie')).toBeDefined();
   })