import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';



 const AppComponent = ({ Component, pageProps, currentUser }) => {
   return (
   <div>
     <Header currentUser={currentUser}/>
     <div className='container'>
      <Component currentUser={currentUser} {...pageProps} />
      </div>
     {/* Component is the page that we are trying to show */}
   </div>
   )
};

AppComponent.getInitialProps = async (appContext) => {
    //create the axios client
   const client = buildClient(appContext.ctx);
   const {data} = await client.get('/api/users/currentuser');

   let pageProps = {};
   if(appContext.Component.getInitialProps) {
   pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
   }
   
  return { 
   pageProps,
   ...data }

}

export default AppComponent