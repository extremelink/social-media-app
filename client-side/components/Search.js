import { useContext, useState } from "react";
import { UserContext } from "../context";
import axios from "axios";
import People from "./cards/People";
import { toast } from "react-toastify";



const Search = () => {
  const [state,setState] = useContext(UserContext);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  const searchUser = async (e) => {
    e.preventDefault();
    // console.log(`Find ${query} from db`);
    try {
      const { data } = await axios.get(`/search-user/${query}`);
      console.log("search user =>", data);
      setResult(data);
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
      let filtered = result.filter((p) => p._id !== user._id);
      setResult(filtered);
      // re-render the post
      toast.success(`you now follow ${user.name}`);
      newsFeed();
      findPeople();
    } catch (err) {
      console.log(err);
    }
  };
  
  const handleUnfollow = async (user) => {
    try{ 
       const { data } = await axios.put('/user-unfollow',{_id:user._id});
       let auth = JSON.parse(localStorage.getItem('auth'));
        auth.user = data;
        localStorage.setItem('auth',JSON.stringify(auth));
        // update context
        setState({ ...state, user:data });
        // update people
        let filtered = result.filter((p)=>p._id !==user._id);
        setResult(filtered);
        toast.success(`successfulyl unfollowed ${user.name}`);
       console.log(data);
    }catch(err){
        console.log(err);
    }
}

  return (
    <>
    <form className="form-inline row pt-2 pb-2" onSubmit={searchUser}>
      <div className="col-8">
        <input
          onChange={(e) => {
            setQuery(e.target.value)
            setResult([])
        }
        }
          value={query}
          className="form-control"
          placeholder="Search"
          type="search"
        />
      </div>
      <div className="col-4">
        <button className="btn btn-outline-primary col-12" type="submit">
          Search
        </button>
      </div>
    </form> 
    {result && result.map((r)=>(
      <People 
        key={r._id} 
        people={result} 
        handleFollow = {handleFollow} 
        handleUnfollow={handleUnfollow} 
        /> )) }
    </>
  );
};
export default Search;
