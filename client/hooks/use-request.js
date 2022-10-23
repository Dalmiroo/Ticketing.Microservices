import axios from 'axios'
import { useState } from 'react'

export default ({url, method, body, onSucess}) => {
  //method==='post', 'get', 'patch'
  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {
   try {
    setErrors(null);
   const response = await axios[method](url,
    {...body, ...props}
    );

   if(onSucess) {
    onSucess(response.data);
   }
   return response.data;
   } catch (error) {
    setErrors(<div className='alert alert-danger'>
    <h4>ooops...</h4>
    <ul className='my-0'>
    {errors.reponse.data.errors.map(error => <li key={error.message}>{error.message}</li>)}
    </ul>
  </div>)
    
   }
  }

  return { doRequest, errors};
}