import express, { Request,Response } from 'express';
import { body} from 'express-validator';
import jwt from 'jsonwebtoken';
import {validateRequest, BadRequestError} from '@dsfticketing/common';
import { User } from '../models/user';


const router = express.Router();

router.post('/api/users/signup', [
  //validation steps
   body('email')
     .isEmail()
     .withMessage('email must be valid'),

    body('password')
    .trim()
    .isLength({min: 4, max: 20})
    .withMessage('password must be between 4 and 20 characters')  

], //validation first, then the middleware 
validateRequest,
 async (req: Request, res: Response) => {

  const {email, password} = req.body;
  
  const existingUser = await User.findOne({email});

  if(existingUser) {
    
    //return res.send({});
   throw new BadRequestError('email in use');
  }

  const user = User.build({email, password});
  await user.save();

  //generate the jwt and and then set it on the session on the req object
 

  const userJwt = jwt.sign({
    id: user.id,
    email: user.email
  }, 
  process.env.JWT_KEY!
  );

  req.session = {
      jwt: userJwt
  };

  res.status(201).send(user);


  //new User  { email, pass}
});

export { router as signupRouter }; //new name because we will have so many routers