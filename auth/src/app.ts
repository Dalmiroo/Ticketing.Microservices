import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import cookieSession from 'cookie-session';
import {errorHandler, NotFoundError} from '@dsfticketing/common'

import { currentUserRouter } from './routes/current-user'; 
import {signinRouter} from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

const app = express();

//traffic is being proxyed to our app through ingress-nginx, express is gonna see the fact 
//that stuff is being proxyed and by default express is gonna say hey wait theres a proxy here
//i dont trust this https connection 
//with this express is aware that is behind a proxy of ingress-nginx and to make sure that it should still
//trust traffic as being secure even though its coming from that proxy
app.set('trust proxy', true); 

app.use(json());
app.use(
  cookieSession ({
     //disable encryption into this cookie (jwt already encrypted)
     signed: false,
     secure: process.env.NODE_ENV !== 'test'
  })
  );

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.get('*', () => {
  throw new NotFoundError;
});


app.use(errorHandler);

export { app };
