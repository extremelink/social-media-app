import { UserContext } from "../../context"
import { useContext } from "react";
import { useRouter } from "next/router";

import Post from "./Post";



const PostList = ({ 
    posts, 
    handleDelete, 
    handleLike, 
    handleUnlike,
    handleComment,
    removeComment
  }) => {
    const [state] = useContext(UserContext);
  const router = useRouter()
  console.log(posts);

  return (
    <>
      {posts &&
        posts.map((post) => (
        <Post 
          key ={post._id}
          post ={post} 
          handleDelete={handleDelete} 
          handleLike={handleLike} 
          handleUnlike={handleUnlike} 
          handleComment={handleComment}
          removeComment={removeComment}
          />
        ))}
    </>
  );
}; 
export default PostList;
