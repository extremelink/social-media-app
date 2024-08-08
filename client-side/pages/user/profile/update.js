import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal, Avatar } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import AuthForm from "../../../components/forms/AuthForm";
import { UserContext } from "../../../context";
import { LoadingOutlined, CameraOutlined } from "@ant-design/icons";
import PostImage from "../../../components/images/PostImage";


const ProfileUpdate = () => {
  const [username, setUsername] = useState("");
  const [about, setAbout] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [question, setQuestion] = useState("");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);

// profile image
const [image,setImage] = useState({});
const [uploading, setUploading] = useState(false);


  const [state, setState] = useContext(UserContext);
  const router = useRouter();
  useEffect(() => {
    if (state && state.user) {
      console.log("state from profile", state.user);
      setUsername(state.user.username);
      setAbout(state.user.about);
      setName(state.user.name);
      setEmail(state.user.email);
      setImage(state.user.image)
    }
  }, [state && state.user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(name, email, password, question, secret,image);
    try {
      setLoading(true);
      const { data } = await axios.put(`/profile-update`, {
        username,
        about,
        name,
        email,
        password,
        secret,
        image
      });
      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        // updatee local storage
        setOk(true);
        setLoading(false);
        let auth = JSON.parse(localStorage.getItem("auth"));
        auth.user = data;
        localStorage.setItem("auth", JSON.stringify(auth));
        setState({ ...state, user: data });
        console.log(state);
      }
    } catch (err) {
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
  };

  const handleImage = async(e) =>{
    const file = e.target.files[0];
    let formData = new FormData();
    formData.append('image',file);
    // console.log([...formData]);
    setUploading(true)
    try{
      const {data} = await axios.post("/upload-image",formData);
      console.log("uploaded image => ",data);
      setImage({
        url: data.url,
        public_id: data.public_id
      })
      setUploading(false);
    }catch(err){
      console.log(err);
      setUploading(false)
    }
  }
  return (
    <div className="container-fluid">
      <div className="row py-5 text-dark bg-register-image">
        <div className="col text-center">
          <h1>ProfileUpdate </h1>
        </div>
      </div>

      {loading ? "" : <Modal title="loading..."></Modal>}
      <div className="row py-5 px-5 bg-tertiary-color">
        <div className="col-md-6 offset-md-3 ">
          {/* upload image */}
        <label className="d-flex justify-content-center h3" style={{cursor:"pointer"}}>
        { image && image.url && <PostImage url={image.url} /> }
          {image && image.url ? (
            <Avatar size={30} src={image.url} className="mt-1" />
          ) : uploading ? (
            <LoadingOutlined className="mt-2" />
          ) : (
            <CameraOutlined className="mt-2" />
          )}
          <input onChange={handleImage} type="file" accept="images/*" hidden />
        </label>


          <AuthForm
            profileUpdate={true}
            username={username}
            setUsername={setUsername}
            about={about}
            setAbout={setAbout}
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            question={question}
            setQuestion={setQuestion}
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
            onCancel={() => setOk(false)}
            footer={null}
          >
            <p>You have successfully updated your profile!!</p>
          </Modal>
        </div>
      </div>
    </div>
  );
};
export default ProfileUpdate;
