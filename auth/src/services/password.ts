import { scrypt, randomBytes } from 'crypto';
import {promisify} from 'util';
//scrypt: hashing function to use (callback based) with promisify we can take that call based 
//function and turn into promise based implementation

const scryptAsync = promisify(scrypt);


export class Password {
  //static methods: we can access without creating an instance of the class
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buff = (await scryptAsync(password, salt, 64)) as Buffer;


    return `${buff.toString('hex')}.${salt}`;
    
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buff = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buff.toString('hex') === hashedPassword;


  }
}

