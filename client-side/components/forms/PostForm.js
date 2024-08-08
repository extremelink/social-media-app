import { Avatar } from "antd";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { CameraOutlined,LoadingOutlined } from "@ant-design/icons";
import PostImage from "../images/PostImage";

const PostForm = ({ 
    content, 
    setContent, 
    postSubmit, 
    handleImage,
    uploading,
    image
}) => {
  return (
    <div className="card">
      <div className="card-body pb-1">
        <form className="form-group">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={(e) => setContent(e)}
            className="form-control"
            placeholder="Write something..."
          ></ReactQuill>
        </form>
      </div>
      <div className="card-footer d-flex justify-content-between text-muted">
        <button
          className="btn btn-primary bt-sm mt-1"
          onClick={postSubmit}
          disabled={!content}
        >
          Post
        </button>

        <label className="h3" style={{cursor:"pointer"}}>
          {image && image.url ? (
            <Avatar size={30} src={image.url} className="mt-1" />
          ) : uploading ? (
            <LoadingOutlined className="mt-2" />
          ) : (
            <CameraOutlined className="mt-2" />
          )}
          <input onChange={handleImage} type="file" accept="images/*" hidden />
        </label>

      </div>
      { image && image.url && <PostImage url={image.url} /> }
    </div>
  );
};

export default PostForm;
