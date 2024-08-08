import { Avatar, List } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { UserContext } from "../../context";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { RollbackOutlined } from "@ant-design/icons";
import Link from "next/link";

const Following = () => {
    const [state, setState] = useContext(UserContext);
    const [people,setPeople] = useState([]);
    const router = useRouter();
 
    useEffect(()=>{
        if(state && state.token) fetchFollowing();
    }, [state && state.token])

    const fetchFollowing = async (req,res) =>{
        try{
            const { data } = await axios.get('/user-following');
            console.log('following =>',data);
            setPeople(data);
        }catch(err){
            console.log(err);
        }
    }

    const handleUnfollow = async (user) => {
        try{ 
           const { data } = await axios.put('/user-unfollow',{_id:user._id});
           let auth = JSON.parse(localStorage.getItem('auth'));
            auth.user = data;
            localStorage.setItem('auth',JSON.stringify(auth));
            // update context
            setState({ ...state, user:data });
            // update people
            let filtered = people.filter((p)=>p._id !==user._id);
            setPeople(filtered);
            toast.success(`successfulyl unfollowed ${user.name}`);
           console.log(data);
        }catch(err){
            console.log(err);
        }
    }

return (
    <div className="row col-md-8 offset-md-3">
        <List 
            itemLayout="horizontal" 
            dataSource={people} 
            renderItem={(user) => (
            <List.Item>
                <List.Item.Meta 
                avatar = {user.image?(
                    <Avatar src={user.image.url} />
                ):(
                    <Avatar size={40} className="mb-2">
                        {user.name[0]}
                        </Avatar>
                )
            }
                title={
                <div className="d-flex justify-content-between" >
                    {user.username}{""}
                    <span 
                        className="text-primary pointer"  
                        onClick={()=>handleUnfollow(user)}
                        >
                        UnFollow
                        </span>
                    </div>} />
            </List.Item>
        )}/>
        <pre>{JSON.stringify(people,null,4)}</pre>
        <Link href="/user/dashboard" legacyBehavior>
        <a className="d-flex justify-content-cente pt-5">
            <RollbackOutlined />
        </a>

        </Link>
    </div>
)
}

export default Following;
