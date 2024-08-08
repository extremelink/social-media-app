import { SyncOutlined } from "@ant-design/icons";


const AuthForm = ({
    username,
    setUsername,
    about,
    setAbout,
    handleSubmit,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    question,
    setQuestion,
    secret,
    setSecret,
    loading,
    page,
    profileUpdate
}) =>{

    return (

    <form onSubmit={handleSubmit}>
      
        {profileUpdate && <>
        <div className="form-group p-2">
          <small>
            <label className="text-muted" htmlFor="">
              Username
            </label>
          </small>
          <input
          value={username}
            type="text"
            className="form-control"
            placeholder="Enter Your Username"
            onChange={e=>setUsername(e.target.value)}
          />
        </div>

        <div className="form-group p-2">
          <small>
            <label className="text-muted" htmlFor="">
              About
            </label>
          </small>
          <input
          value={about}
            type="text"
            className="form-control"
            placeholder="Enter something about yourself"
            onChange={e=>setAbout(e.target.value)}
          />
        </div>
        </>
        }
                
            {page!="login" &&<div className="form-group p-2">
              <small>
                <label className="text-muted" htmlFor="">
                  Your Name
                </label>
              </small>
              <input
              value={name}
                type="text"
                className="form-control"
                placeholder="Enter Your Name"
                onChange={e=>setName(e.target.value)}
              />
            </div>}

            <div className="form-group p-2">
              <small>
                <label className="text-muted" htmlFor="">
                  Email
                </label>
              </small>
              <input
              value={email}
                type="email"
                className="form-control"
                placeholder="Enter Your Email"
                onChange={e=>setEmail(e.target.value)}
                disabled={profileUpdate}
              />
            </div>

            <div className="form-group p-2">
              <small>
                <label className="text-muted" htmlFor="">
                  Password
                </label>
              </small>
              <input
              value={password}
                type="password"
                className="form-control"
                placeholder="Enter Your Password"
                onChange={e=>setPassword(e.target.value)}
              />
            </div>

            {page!="login" &&(
                <>
                <div className="form-group p-2">
                <small>
                    <label className="text-muted" htmlFor="">Pick a question</label>
                </small>
                <select className="form-control" value={question} name="" id="" onChange={e=>setQuestion(e.target.value)}>
                    <option>what is your favourite color</option>
                    <option>what is your best friend's name</option>
                    <option>which city you were born in?</option>
                </select>
                <small className="form-text text-muted">
                    You can use this to reset your password if forgotten.
                </small>
            </div>
             <div className="form-group p-2">
                <input 
                    value={secret}
                    type="text"
                    className="form-control" 
                    placeholder="enter your answer"
                    onChange={e=>setSecret(e.target.value)}
                    />
                </div> 
                </>
            )}

            <div className="form-group p-2">
            <button 
              disabled={
                profileUpdate
                ? loading
                :page==="login"
                ? !email || !password || loading
                : !name || !email || !secret || !password || loading} 
              className="btn btn-primary col-12">
                
                {loading ? <SyncOutlined spin className="py-1" /> :"Submit"}                
                </button>
            </div>
            
          </form>

    )

     
}

export default AuthForm;