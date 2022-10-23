import express from 'express';
import { currentUser } from '@dsfticketing/common';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
    res.send({ currentUser: req.currentUser || null});

});

export { router as currentUserRouter }; //new name because we will have so many routers

/*THE GOAL OF THE CURRENT USER ROUTE HANDLER 
at some point in time our react app is gonna need to figure out whether or not the user is signed in
 to our app.
 The react app cannot directly look at the cookie and try to inspect and decide whether or not theres a valid
 JWT inside there, we set up our cookies in such a way that cannot be executed or access from JS running inside browser.
 so the react app needs to be able to make a request to something inside of our app to figure out whether or not
 the user is logged in*/