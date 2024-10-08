import axios from "axios";
import Head from "next/head";
import ParallaxBG from "../../../components/cards/ParallaxBG";
import PostPublic from "../../../components/cards/PostPublic";


const SinglePost = ({ post }) => {
    console.log('post contents',post)
  const head = () => (
    <Head>
      <title>MERNCAMP - A social network by devs for devs</title>
      <meta
        name="description"
        content={post.content}
      />
      <meta
        property="og:description"
        content="A social netwok by developers for other developers"
      />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="MERNCAMP" />
      <meta property="og:url" content={`http://merncamp.com/post/view${post._id}`} />
      <meta
        property="og:image:secure_url"
        content={imageSource(post)}
      />
    </Head>
  );

  const imageSource=(user)=>{
    if(post.image){
        return post.image.url;
    }else{
        return "/images/default.jpg";
    }
}


  return (
    <>
      {head()}
      <ParallaxBG url="/images/default.jpg">SOCIAL NETWORK</ParallaxBG>

      <div className="container">
        <div className="row pt-5">
            <div className="col-md-7 offset-md-2">
                <PostPublic key={post._id} post={post} />
            </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(ctx) {
    const data = await axios.get(`/post/${ctx.params._id}`)
      .then(response => response.data)
      .catch(err => {
        console.log(err);
        return [];
      });
  
    console.log("this is my data", data);
    return {
      props: {
        post: data,
      },
    };
  }
  

export default SinglePost;
