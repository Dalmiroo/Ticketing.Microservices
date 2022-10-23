import { Router } from "next/dist/client/router";
import { useEffect } from "react";
import useRequest from '../../hooks/use-request';

export default () => {

  const {doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/')
  })
   useEffect( () => {
   doRequest();
   }, [])
  return <div>Signing u out..</div>;
}

