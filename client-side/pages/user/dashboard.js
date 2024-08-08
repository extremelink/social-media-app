import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context";

import UserRoute from "../../components/routes/UserRoutes";
import PostForm from "../../components/forms/PostForm";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import PostList from "../../components/cards/PostList";
import People from "../../components/cards/People";
import Link from "next/link";
import { Modal, Pagination } from "antd";
import CommentForm from "../../components/forms/CommentForm";
import Search from "../../components/Search";

import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SOCKETIO,
  {path : "/socket.io"},
  {
    reconnection: true,
})


const Home = () => {
  const [state, setState] = useContext(UserContext);
  //   state
  const [content, setContent] = useState("");
  const [image, setImage] = useState({});
  const [uploading, setUploading] = useState(false);
  // posts
  const [posts, setPosts] = useState([]);
  const [people, setPeople] = useState([]);
  // comments
  const [comment, setComment] = useState("");
  const [visible, setVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState({});
  // Pagination
  const [totalPosts, setTotalPosts] = useState(0);
  const [page, setPage] = useState(1);

  //   route
  const router = useRouter();
  state.user&&console.log(state.user.role)

  useEffect(() => {
    if (state && state.token) {
      newsFeed();
      findPeople();
    }
  }, [state && state.token, page]);

  useEffect(() => {
    const getTotalPosts = async () => {
      try {
        const { data } = await axios.get("/total-posts");
        setTotalPosts(data);
      } catch (err) {
        console.log(err);
      }
    };
    getTotalPosts();
  }, [posts]);

  const newsFeed = async () => {
    try {
      const { data } = await axios.get(`/news-feed/${page}`);
      setPosts(data);
      console.log("data in newsfeed",data)
    } catch (err) {
      console.log(err);
    }
  };

  const findPeople = async () => {
    try {
      const { data } = await axios.get("/find-people");
      console.log("data from server", data);
      setPeople(data);
    } catch (err) {
      console.log(err);
    }
  };

  const postSubmit = async (e) => {
    e.preventDefault();
    console.log("post => ", content);
    try {
      const { data } = await axios.post("/create-post", { content, image });
      console.log("create post response => ", data);
      if (data.error) {
        toast.error(data.error);
      } else {
        setPage(1)
        newsFeed();
        toast.success("Post Created");
        setContent("");
        setImage({});
        socket.emit("new-post",data);
      }
    } catch (err) {
      toast.error(err);
      console.log(err);
    }
  };
  const handleImage = async (e) => {
    const file = e.target.files[0];
    let formData = new FormData();
    formData.append("image", file);
    // console.log([...formData]);
    setUploading(true);
    try {
      const { data } = await axios.post("/upload-image", formData);
      console.log("uploaded image => ", data);
      setImage({
        url: data.url,
        public_id: data.public_id,
      });
      setUploading(false);
    } catch (err) {
      console.log(err);
      setUploading(false);
    }
  };

  const handleDelete = async (post) => {
    try {
      const answer = window.confirm("Are you sure?");
      if (!answer) return;
      const { data } = await axios.delete(`/delete-post/${post._id}`);
      toast.success("Post Deleted!!");
      newsFeed();
    } catch (err) {
      console.log(err);
    }
  };

  const handleFollow = async (user) => {
    // console.log('add this user to following list',user);
    try {
      const { data } = await axios.put("/user-follow", { _id: user._id });
      console.log("handle follow response", data);
      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data;
      localStorage.setItem("auth", JSON.stringify(auth));
      setState({ ...state, user: data });
      let filtered = people.filter((p) => p._id !== user._id);
      setPeople(filtered);
      // re-render the post
      toast.success(`you now follow ${user.name}`);
      newsFeed();
      findPeople();
    } catch (err) {
      console.log(err);
    }
  };
  const handleLike = async (_id) => {
    try {
      console.log("like this post => ", _id);
      const { data } = await axios.put("/like-post", { _id });
      console.log("liked", data);
      newsFeed();
    } catch (err) {}
  };

  const handleUnlike = async (_id) => {
    try {
      console.log("like this post => ", _id);
      const { data } = await axios.put("/unlike-post", { _id });
      console.log("unliked", data);
      newsFeed();
    } catch (err) {
      console.log(err);
    }
  };

  const handleComment = (post) => {
    setCurrentPost(post);
    setVisible(true);
  };

  const addComment = async (e) => {
    e.preventDefault();
    console.log("add comment to this post id", currentPost._id);
    console.log("save comment to db", comment);
    try {
      const { data } = await axios.put("/add-comment", {
        postId: currentPost._id,
        comment,
      });
      console.log("add comment", data);
      setComment("");
      setVisible(false);
      newsFeed();
    } catch (err) {
      console.log(err);
    }
  };

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
            newsFeed();
    }catch(err){
        console.log(err)
    }
}
  return (
    <UserRoute>
      <div className="container-fluid">
        <div className="row py-5 text-dark bg-register-image">
          <div className="col text-center">
            <h1>NewsFeed</h1>
          </div>
        </div>

        <div className="row py-3">
          <div className="col-md-8">
            <PostForm
              content={content}
              setContent={setContent}
              postSubmit={postSubmit}
              handleImage={handleImage}
              uploading={uploading}
              image={image}
            />
            <br />
            <PostList
              posts={posts}
              handleDelete={handleDelete}
              handleLike={handleLike}
              handleUnlike={handleUnlike}
              handleComment={handleComment}
              removeComment = {removeComment}
            />
            <Pagination
            className="pb-5"
              current={page}
              total={Math.ceil(totalPosts / 3)*10}
              onChange
              ={
                (value) => {
                console.log('page value',value);
                setPage(value)
                }
              }
            />
            <pre>{JSON.stringify(totalPosts)}</pre>
          </div>
          <div className="col-md-4">
            <Search />
            {state && state.user && state.user.following && (
              <Link href={`/user/following`} legacyBehavior>
                <a className="h6">{state.user.following.length} Following</a>
              </Link>
            )}
          
            <People people={people} handleFollow={handleFollow} />
          </div>
          <pre>{JSON.stringify(posts)}</pre>
        </div>
        <Modal
          open={visible}
          onCancel={() => setVisible(false)}
          title="Comment"
          footer={null}
        >
          <CommentForm
            comment={comment}
            addComment={addComment}
            setComment={setComment}
          />
        </Modal>
      </div>
    </UserRoute>
  );
};
export default Home;
