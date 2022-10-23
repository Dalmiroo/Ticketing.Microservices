import { MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from "supertest";
import jwt from 'jsonwebtoken'

//start a copy of mongodb in memory thats gonna allow us to run multiple different tests
// at the same time across different projects without them all trying to reach out to the same
//copy of mongo

//global property TS CODE

declare global {
  var signin: () => string[];
}


//ONLY TEST ENVIRONMENT
//if u try to import the nats-wrapper file instead do a redirect and get this other fake file
jest.mock('../nats-wrapper');


let mongo: any;

beforeAll( async () => {

  process.env.JWT_KEY = 'asdasda';
  
   const mongo = await MongoMemoryServer.create();
   const mongoUri = mongo.getUri();


   await mongoose.connect(mongoUri, {});
}); //this function is gonna run before all our tests start to be executed


beforeEach( async () => {
  jest.clearAllMocks();
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

global.signin = () => {
  //build a  JWT Payload {id, email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test.test.com'
  }
  //create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  //build the session object {jwt: MY_JWT}

  const session = {jwt: token};
  //turn that session into JSON
  const sessionJSON = JSON.stringify(session);
  //take JSON and encode it as base64
   const base64 = Buffer.from(sessionJSON).toString('base64');
  //return string thats the cookie with the encoded data

    return [`session=${base64}`];
};