import axios from "axios";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import Post from "../../components/cards/Post";
import Link from "next/link";
import { RollbackOutlined } from "@ant-design/icons";

const PostComments = () =>{
    const [post,setPost] = useState({});
    const router = useRouter();
    const _id = router.query._id;
    
    useEffect(()=>{
        if(_id)fetchPost();

    }, [_id]);

    const fetchPost = async () =>{
        try{
            const { data } = await axios.get(`/user-post/${_id}`)
            setPost(data);
            console.log('from id post',data);
        }catch(err){
            console.log(err);
        }
    }
    const removeComment = async (postId, comment) =>{
        let answer = window.confirm(" Are you sure? ");
        if(!answer)return;
        try{
            console.log(postId,comment)
            const { data } = await axios.put('/remove-comment',
                {
                    postId,
                    comment
                })
                console.log("comment removed", data);
                fetchPost();
        }catch(err){
            console.log(err)
        }
    }

    return(
        <div className="container-fluid">
            <div className="row py-5 bg-register-image">
                <div className="col text-center">
                    <h1>MernCamp</h1>
                </div>
            </div>
            <div className="container col-md-8 offset-md-2 pt-5">
            <Post post={post} commentsCount={100} removeComment={removeComment} />
            </div>
            <Link href="/user/dashboard" legacyBehavior>
                <a className="d-flex justify-content-center p-2"><RollbackOutlined /></a>
            </Link>
        </div>
    )

}
export default PostComments