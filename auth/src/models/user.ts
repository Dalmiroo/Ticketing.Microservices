import { buildCheckFunction } from "express-validator";
import mongoose from "mongoose";
import { Password } from "../services/password";

//an interface that describes the properties 
//that are required to create a new User
interface UserAttrs {
   email: string;
   password: string;
}

//an interface that describes the properties that a user model has
interface UserModel extends mongoose.Model<UserDoc> {
     build(attrs: UserAttrs): UserDoc;
}

//an interface that describes the properties that a USER DOCUMENT has (a single user)

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
 // createdAt: string;
 // updatedAt: string;
}

const userSchema = new mongoose.Schema ({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  toJSON: {
   //properties that help mongoose take our USER DOCUMENT and turn it into JSON
   transform(doc,ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.password; //remove the pass properties of the object 
    delete ret.__v;
   }
  }
});

userSchema.pre('save', async function (done) {
  //middleware function implemented in mongoose 
  if(this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));

    this.set('password', hashed);
  }

  done();
})

userSchema.statics.build = (attrs: UserAttrs) => {
  //the goal of this function is to allow typescript to do some validation or 
  //typechecking on the properties we are trying to use to create a new record
  //this is a function for creating a user, instead of "new User"
  //we added this function to our model
   return new User(attrs);
}


const User = mongoose.model<UserDoc, UserModel> ('User', userSchema);



export { User };