import React, { useContext, useState } from "react";
import axios from 'axios';
import { toast} from 'react-toastify';
import { Modal } from "antd";
import Link from "next/link";
import AuthForm from "../components/forms/AuthForm";
import { useRouter } from "next/router";
import { UserContext } from "../context";


const Login = () => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [state,setState] = useContext(UserContext);
  const router = useRouter();

  const handleSubmit=async (e)=>{
    e.preventDefault();
    console.log(email,password); 
    
    try{
      setLoading(true);
      const  { data }  = await axios.post('/login',{
        email,password
      })
      console.log(data)
      if(data.error){
        toast.error(data.error);
        setLoading(false);
      }else{
        // update context
        setState({
          user:data.user,
          token:data.token
        })
        //save in localstorage 
      window.localStorage.setItem('auth',JSON.stringify(data));
      router.push("/");
      }
      setEmail('')
      setPassword('')
      setLoading(false);

    }catch(err){
      console.log(err,err.response)
      toast.error(err.response.data);
      setLoading(false);
    }
  }

  if(state && state.token) router.push("/user/dashboard");


  return (
    <div className="container-fluid">
      <div className="row py-5 text-dark bg-register-image">
        <div className="col text-center">
          <h1>Login Page</h1>
        </div>
      </div>

      {loading?'':<Modal title="loading..."open={loading}><p>Loading....</p></Modal>}
      <div className="row py-5 px-5 bg-tertiary-color">
        <div className="col-md-6 offset-md-3 ">
          <AuthForm
            handleSubmit={handleSubmit}
           email = {email}
           setEmail = {setEmail}
           password={password}
           setPassword={setPassword}
           loading={loading}
           page="login"
           />
        </div>
      </div>
      

      <div className="row">
        <div className="col">
          <p className="text-center">
            Not yet registered ?{""}
            <Link href="/register"legacyBehavior={true}>
                <a>Register</a>
            </Link>
            </p>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <p className="text-center">
            Forgot password ?{""}
            <Link href="/forgot-password"legacyBehavior={true}>
                <a className="text-danger">Forgot Password</a>
            </Link>
            </p>
        </div>
      </div>

    </div>
  );
};
export default Login;
