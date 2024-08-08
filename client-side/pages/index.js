import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context";
import ParallaxBG from "../components/cards/ParallaxBG";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import PostPublic from "../components/cards/PostPublic";
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SOCKETIO,
  {path : "/socket.io"},
  {
    reconnection: true,
})


const MernCamp = ({ posts }) => {
  const [state, setState] = useContext(UserContext);
  const [newsFeed,setNewsFeed] = useState([]);  
  // console.log(posts)

    useEffect(()=>{
        console.log("SOCKETIO ON JOIN", socket);
        socket.on('receive-message',(newMessage)=>{
            alert(newMessage);
        })
    },[])
    useEffect(() => {
      socket.on('new-post',(newPost)=>{
        console.log(newPost)
        setNewsFeed([newPost,...posts])
      })
    }, [])


  const head = () => (
    <Head>
      <title>MernCamp A social network </title>
      <meta
        name="description"
        content="A social network for other web developers"
      />
      <meta
        property="og:description"
        content="A social netwok by developers for other developers"
      />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="MERNCAMP" />
      <meta property="og:url" content="http://merncamp.com" />
      <meta
        property="og:image:secure_url"
        content="http://merncamp.com/images/default.jpg"
      />
    </Head>
  );

  const collection = newsFeed.length >0?newsFeed:posts;

  return (
    <>
      {head()}
      <ParallaxBG url="/images/default.jpg">SOCIAL NETWORK</ParallaxBG>
      <div className="container">
        <button onClick={()=>{
            socket.emit('send-message',"This is ryan")
        }}>
            Send message
        </button>
        <div className="row pt-5">
          {collection.map((post) => (
            <div key={post._id} className="col-md-4">
              <Link href={`/post/view/${post._id}`} legacyBehavior>
              <div style={{ cursor :'pointer'}}>
                <PostPublic post={post} />    
              </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
    const data = await axios.get("/posts")
      .then(response => response.data)
      .catch(err => {
        console.log(err);
        return [];
      });
  
    console.log("this is my data", data);
    return {
      props: {
        posts: data,
      },
    };
  }
  

export default MernCamp;
