import moment from "moment";
import { Avatar } from "antd";
import HtmlContent from "../HtmlContent";
import PostImage from "../images/PostImage";
import {
  HeartOutlined,
  HeartFilled,
  CommentOutlined,
} from "@ant-design/icons";
import { useContext } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../../context";
import { imageSource } from "../../functions";

UserContext;
const PostPublic = ({
  post,
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
                  className="text-danger pt-2 h5 px-2"
                />
              ) : (
                <HeartOutlined
                  className="text-danger pt-2 h5 px-2"
                />
              )}
              <div className="pt-2 pl-3" style={{ marginRight: "2rem" }}>
                <a>{post.likes.length} likes </a>
              </div>

              <CommentOutlined
                className="text-danger pt-2 h5 px-2"
              />
              <div className="pt-2 pl-3" style={{ marginRight: "2rem" }}>
                  {post.comments.length} comments
              </div>
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
export default PostPublic;
