import React, { useState, useContext } from "react";
import axios from 'axios';
import { toast} from 'react-toastify';
import { Modal } from "antd";
import Link from "next/link";
import { UserContext } from "../context";
import { useRouter } from "next/router";
import ForgotPasswordForm from "../components/forms/ForgotPasswordForm";

const ForgotPassword = () => {
  const [email,setEmail] = useState('');
  const [newPassword,setNewPassword] = useState('');
  const [question,setQuestion] = useState('');
  const [secret,setSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [ok,setOk] = useState(false);
  console.log('address',process.env.NEXT_PUBLIC_API)

  const [state,setState] = useContext(UserContext)
  const router = useRouter();
  
  const handleSubmit=async (e)=>{
    e.preventDefault();
    console.log(email,newPassword,question,secret); 
    try{
      setLoading(true);
      const  { data }  = await axios.post(`/forgot-password`,{
        email,newPassword,secret
      })
      console.log('forgot password res data => ',data);
      if(data.error){
        toast.error(data.error,{
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
      }else{
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
            setEmail('')
            setNewPassword('')
            setSecret('')
            setOk(true);
            setLoading(false);
      }
     

    }catch(err){
      console.log(err,err.response)
      toast.error(err, {
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
          <h1>Forgot Password</h1>
        </div>
      </div>

      {loading?'':<Modal title="loading..."></Modal>}

      <div className="row py-5 px-5 bg-tertiary-color">
        <div className="col-md-6 offset-md-3 ">
          <ForgotPasswordForm
          handleSubmit={handleSubmit}
           email = {email}
           setEmail = {setEmail}
           newPassword={newPassword}
           setNewPassword={setNewPassword}
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
          {ok&&<Modal 
            title="Congratulations!!"
            open={ok}
            onCancel={()=>setOk(false)}
            footer={null}
          >
            <p>Congrats! you can login with new password</p>
            <Link href="/login" passHref={true} legacyBehavior={true}>
                <a className="btn btn-primary btn-sm">Login</a>
            </Link>
          </Modal>}
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
export default ForgotPassword;
