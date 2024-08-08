import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { SyncOutlined } from "@ant-design/icons";
import { UserContext } from "../../context";

const AdminRoute = ({children}) => {
    const [ok,setOk] = useState(false);
    const router = useRouter();
    const [state,setState] = useContext(UserContext);
    useEffect(()=>{
        if(state && state.token)getCurrentAdmin()
    }, [state && state.token]);
    
    const getCurrentAdmin = async() =>{
      
        try{
        const {data} = await axios.get(
            '/current-admin',
        {
            headers: {
                Authorization: `Bearer ${state.token}`
            }
        })
        if(data.ok)setOk(true);
        console.log('data and ok',data,ok);
      }catch(err){
        router.push("/");
        console.log(err);
      }
    }
    process.browser && state === null && setTimeout(()=>{
        getCurrentAdmin();
    },1000);
    return !ok ? ( 
        <SyncOutlined 
            spin 
            className="d-flex justify-content-center display-1 text-primary p-5"
            />
        ): (
            <>{children}</>
        );
};

export default AdminRoute;
