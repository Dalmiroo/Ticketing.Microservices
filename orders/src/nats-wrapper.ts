import nats, {Stan} from 'node-nats-streaming';


class NatsWrapper {
   private _client?: Stan; //? tells typescript that this property might be undifined for some period of time

   //defines the client property on the instance
   get client() {
    if(!this._client) {
      throw new Error('cannot access nats client before connecting ');
    }
   return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
  this._client = nats.connect(clusterId, clientId, {url} );

   


   return new Promise<void>( (resolve, reject) => {
    this.client!.on('connect', () => {
      console.log('connected to NATS')
      resolve();
     })

     
     this.client!.on('error', (error) => {
      reject(error);
     })
   })    
   }

}



export const natsWrapper = new NatsWrapper();