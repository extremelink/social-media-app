import moment from "moment";
import { Avatar } from "antd";
import HtmlContent from "../HtmlContent";
import PostImage from "../images/PostImage";
import {
  HeartOutlined,
  HeartFilled,
  CommentOutlined,
  EditOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import { useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { UserContext } from "../../context";
import { imageSource } from "../../functions";

UserContext;
const Post = ({
  post,
  handleDelete,
  handleLike,
  handleUnlike,
  handleComment,
  removeComment,
  addComment,
  commentsCount = 2,
}) => {
  const [state] = useContext(UserContext);
  const router = useRouter();
  


  return (
    <>
      {post && post.postedBy && (
        <div key={post._id} className="card mb-5">
          <div className="card-header">
            <div>
              <Avatar
                className="mb-2 fs-3"
                size={45}
                src={imageSource(post.postedBy)}
              >
                {!imageSource(post.postedBy) && post.postedBy.name[0]}
              </Avatar>

              <span className="pt-2 ml-3" style={{ marginLeft: "1rem" }}>
                {post.postedBy.name}
              </span>
              <span className="pt-2 ml-3" style={{ marginLeft: "1rem" }}>
                {moment(post.createdAt).fromNow()}
              </span>
            </div>
          </div>
          <div className="card-body">
            <HtmlContent html={post.content} />
          </div>

          <div className="card-footer">
            {post.image && <PostImage url={post.image.url} />}
            <div className="d-flex">
              {state && state.user && post.likes.includes(state.user._id) ? (
                <HeartFilled
                  onClick={() => handleUnlike(post._id)}
                  className="text-danger pt-2 h5 px-2"
                />
              ) : (
                <HeartOutlined
                  onClick={() => handleLike(post._id)}
                  className="text-danger pt-2 h5 px-2"
                />
              )}
              <div className="pt-2 pl-3" style={{ marginRight: "2rem" }}>
                <a>{post.likes.length} likes </a>
              </div>

              <CommentOutlined
                onClick={() => handleComment(post)}
                className="text-danger pt-2 h5 px-2"
              />
              <div className="pt-2 pl-3" style={{ marginRight: "2rem" }}>
                <Link href={`/post/${post._id}`} legacyBehavior>
                  <a>{post.comments.length} comments</a>
                </Link>
              </div>

              {state && state.user && state.user._id == post.postedBy._id && (
                <>
                  <EditOutlined
                    onClick={() => router.push(`/user/post/${post._id}`)}
                    className="text-danger pt-2 h5 px-2 mx-auto"
                  />
                  <DeleteOutlined
                    onClick={() => handleDelete(post)}
                    className="text-danger pt-2 h5 px-2"
                  />
                </>
              )}
            </div>
          </div>
          {/* 2 comments */}
          {post.comments && post.comments.length > 0 && (
            <ol className="list-group" style={{maxHeight:'125',overflowY:'scroll'}}>
              {post.comments.slice(0,commentsCount).map((c) => (
                <li key={c._id} className="list-group-item d-flex justify-content-between align-items-start">
                  <div className="ms-2 me-auto">
                    <div>
                      <Avatar
                        size={20}
                        src={imageSource(c.postedBy)}
                        className="mb-1 mr-3"
                      />
                      {c.postedBy.name}
                    </div>
                    <div>{c.text}</div>
                  </div>
                  <span className="badge rounded-pill text-muted">
                    {moment(c.created).fromNow()}
                    {state && state.user && state.user._id==c.postedBy._id && (
                        <div className="ml-auto mt-1">
                            <DeleteOutlined onClick={()=>removeComment(post._id,c)} className="text-danger" />
                        </div> 
                    )}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </>
  );
};
export default Post;
