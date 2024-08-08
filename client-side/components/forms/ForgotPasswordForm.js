import { SyncOutlined } from "@ant-design/icons";


const ForgotPasswordForm = ({
    handleSubmit,
    email,
    setEmail,
    newPassword,
    setNewPassword,
    question,
    setQuestion,
    secret,
    setSecret,
    loading,
    page
}) =>{

    return (

    <form onSubmit={handleSubmit}>
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
              />
            </div>

            <div className="form-group p-2">
              <small>
                <label className="text-muted" htmlFor="">
                  New Password
                </label>
              </small>
              <input
              value={newPassword}
                type="password"
                className="form-control"
                placeholder="Enter New Password"
                onChange={e=>setNewPassword(e.target.value)}
              />
            </div>

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

            <div className="form-group p-2">
            <button 
              disabled={!email || !newPassword || !secret || loading} 
              className="btn btn-primary col-12">
                
                {loading ? <SyncOutlined spin className="py-1" /> :"Submit"}                
                </button>
            </div>
            
          </form>

    ) 
}
export default ForgotPasswordForm;