import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
  //empty out all the info inside the user's cookie 
  //with the cookie session library
  req.session = null;


  res.send({});
});

export { router as signoutRouter }; //new name because we will have so many routers