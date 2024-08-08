import { Avatar, List } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { UserContext } from "../../context";
import { useContext } from "react";
import { imageSource } from "../../functions";
import Link from "next/link";

const People = ({ people, handleFollow, handleUnfollow}) => {
    const [state] = useContext(UserContext);
    const router = useRouter();
    console.log('people',people)

return (
  <>
    <List
      itemLayout="horizontal"
      dataSource={people}
      renderItem={(user) => (
        <List.Item>
          <List.Item.Meta
            avatar = {user.image?(
              <Avatar src={user.image.url} />
          ):(
              <Avatar size={40} className="mb-2">
                  {user.name[0]}
                  </Avatar>
          )
      }
            title={
              <div className="d-flex justify-content-between">
                <Link href={`/user/${user.username}`}>
                {user.username} 
                </Link>
                {state && 
                  state.user &&
                  user.followers &&
                  user.followers.includes(state.user._id) ? (
                    <span 
                      onClick={() => handleUnfollow(user)}
                      className="text-primary pointer"
                      >
                        Unfollow
                      </span>
                  ) : (
                    <span 
                      onClick={()=>handleFollow(user)}
                      className="text-primary pointer">
                        Follow
                      </span>
                  )
                }
              </div>
            }
          />
        </List.Item>
      )}
    />
    {/* <pre>{JSON.stringify(people, null, 4)}</pre> */}
  </>
);
}

export default People;
