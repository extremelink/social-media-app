import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context";

import UserRoute from "../../components/routes/UserRoutes";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import AdminRoute from "../../components/routes/AdminRoute";


const Admin = () => {
  const [state, setState] = useContext(UserContext);
  // posts
  const [posts, setPosts] = useState([]);
  //   route
  const router = useRouter();

  useEffect(() => {
    if (state && state.token) {
      newsFeed();
    }
  }, [state && state.token]);


  const newsFeed = async () => {
    try {
      const { data } = await axios.get(`/posts`);
      setPosts(data);
      console.log("data in newsfeed",data)
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (post) => {
    try {
      const answer = window.confirm("Are you sure?");
      if (!answer) return;
      const { data } = await axios.delete(`/admin/delete-post/${post._id}`);
      toast.success("Post Deleted!!");
      newsFeed();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AdminRoute>
      <div className="container-fluid">
        <div className="row py-5 text-dark bg-register-image">
          <div className="col text-center">
            <h1>Admin</h1>
          </div>
        </div>
        <div className="row  py-4">
          <div className="col-md-8 offset-md-2">
            {posts &&  posts.map(post => (
              <div key={post._id} className="d-flex justify-content-between">
                {post.content} - <b>{post.postedBy.name}</b>{" "}
                <span onClick={() => handleDelete(post)} className="text-danger">
                  Delete
                  </span>
                </div>
            ))

            }

          </div>

        </div>
      </div>
    </AdminRoute>
  );
};
export default Admin;
