import express, {Request, Response} from 'express';
//body method is gonna be used as a middleware to validate incoming data on the body of the post request
import { body } from 'express-validator';
import {validateRequest, BadRequestError} from '@dsfticketing/common';
import { Password } from '../services/password';
import { User } from '../models/user';

import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/signin', 
[
  body('email')
  .isEmail()
  .withMessage('email must be valid'),
  body('password')
  .trim()
  .notEmpty()
  .withMessage('you must supply a password')
], 
validateRequest,
async (req: Request, res: Response) => {
    const {email, password} = req.body;

    const existingUser = await User.findOne({email});
    if(!existingUser) {
    throw new BadRequestError('Invalid credentials');
    }
    //note: await because comparing passwords is asynchronous
    const passwordsMatch = await Password.compare(existingUser.password, password);

    if(!passwordsMatch) {
      throw new BadRequestError('invalid credentials');
    }

    const userJwt = jwt.sign({
      id: existingUser.id,
      email: existingUser.email
    }, 
    process.env.JWT_KEY!
    );
  
    req.session = {
        jwt: userJwt
    };
  
    res.status(200).send(existingUser);
  
});

export { router as signinRouter }; //new name because we will have so many routers