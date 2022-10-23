import { MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from "supertest";

//start a copy of mongodb in memory thats gonna allow us to run multiple different tests
// at the same time across different projects without them all trying to reach out to the same
//copy of mongo

//global property TS CODE

declare global {
  var signin: () => Promise<string[]>;
}

let mongo: any;

beforeAll( async () => {

  process.env.JWT_KEY = 'asdasda';
  
   const mongo = await MongoMemoryServer.create();
   const mongoUri = mongo.getUri();


   await mongoose.connect(mongoUri, {});
}); //this function is gonna run before all our tests start to be executed


beforeEach( async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
})

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
  .post('api/users/signup')
  .send({ email, password })
  .expect(201);

  const cookie = response.get('Set-Cookie');

  return cookie;
};