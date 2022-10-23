import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import cookieSession from 'cookie-session';
import {errorHandler, NotFoundError, currentUser} from '@dsfticketing/common'
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes/index';
import {deleteOrderRouter } from './routes/delete';

const app = express();

//traffic is being proxyed to our app through ingress-nginx, express is gonna see the fact 
//that stuff is being proxyed and by default express is gonna say hey wait theres a proxy here
//i dont trust this https connection 
//with this express is aware that is behind a proxy of ingress-nginx and to make sure that it should still
//trust traffic as being secure even though its coming from that proxy
app.set('trust proxy', true); 
app.use(
  cookieSession ({
     //disable encryption into this cookie (jwt already encrypted)
     signed: false,
     secure: process.env.NODE_ENV !== 'test'
  })
  );
//cookie session has to run first so so it can take a look at the cookie and set the
//req.session property, otherwise req.session will not be set.
  app.use(currentUser)

app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

app.get('*', () => {
  throw new NotFoundError;
});


app.use(errorHandler);

export { app };
