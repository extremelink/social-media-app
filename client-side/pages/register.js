import React, { useState, useContext } from "react";
import axios from 'axios';
import { toast} from 'react-toastify';
import { Modal } from "antd";
import Link from "next/link";
import AuthForm from "../components/forms/AuthForm";
import { UserContext } from "../context";
import { useRouter } from "next/router";

const Register = () => {
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [question,setQuestion] = useState('');
  const [secret,setSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [ok,setOk] = useState(false);
  console.log('address',process.env.NEXT_PUBLIC_API)

  const [state,setState] = useContext(UserContext)
  const router = useRouter();
  
  const handleSubmit=async (e)=>{
    e.preventDefault();
    console.log(name,email,password,question,secret); 
    try{
      setLoading(true);
      const  { data }  = await axios.post(`/register`,{
        name,email,password,secret
      })
      if(data.error){
        toast.error(data.error);
        setLoading(false);
      }else {
        setName('')
        setEmail('')
        setPassword('')
        setSecret('')
        setOk(data.ok);
        setLoading(false);
        toast.success(data.data, {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              });
             
      }
    }catch(err){
      toast.error(err.response.data, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
        setLoading(false);
    }
  }
  if(state && state.token) router.push("/")


  return (
    <div className="container-fluid">
      <div className="row py-5 text-dark bg-register-image">
        <div className="col text-center">
          <h1>Register </h1>
        </div>
      </div>

      {loading?'':<Modal title="loading..."></Modal>}

      <div className="row py-5 px-5 bg-tertiary-color">
        <div className="col-md-6 offset-md-3 ">
          <AuthForm
          handleSubmit={handleSubmit}
           name={name}
           setName={setName}
           email = {email}
           setEmail = {setEmail}
           password={password}
           setPassword={setPassword}
           question={question}
           setQuestion ={setQuestion}
           secret={secret}
           setSecret={setSecret}
           loading={loading}
           />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <Modal 
            title="Congratulations!!"
            open={ok}
            onCancel={()=>setOk(false)}
            footer={null}
          >
            <p>You have successfully registered!</p>
            <Link href="/login" passHref={true} legacyBehavior={true}>
                <a className="btn btn-primary btn-sm">Login</a>
            </Link>
          </Modal>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <p className="text-center">
            Already Registered ?{""}
            <Link href="/login"legacyBehavior={true}>
                <a>Login</a>
            </Link>
            </p>
        </div>
      </div>

    </div>
  );
};
export default Register;
