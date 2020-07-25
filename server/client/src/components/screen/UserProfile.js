import React,{useContext,useRef,useEffect,useState} from 'react'
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";
import M from 'materialize-css'
const UserProfile = () => {
  const  followingModalu = useRef(null)
  const  followedModalu = useRef(null)
  const [userProfile, setProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [showFollow,setShowFollow] = useState(state ? !state.following.includes(userid):true);


  useEffect(()=>{
    M.Modal.init(followingModalu.current)
    M.Modal.init(followedModalu.current)
  },[])
  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result);
        setProfile(result);
      });
  }, []);

  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        dispatch({type:"UPDATE", payload:{following:data.following, followers:data.followers}})
        localStorage.setItem("user", JSON.stringify(data))
        setProfile((prevState)=>{
          return {
            ...prevState,
            user:{
              ...prevState.user,
              followers:[...prevState.user.followers,data._id]
            }
          }
        })
        setShowFollow(false)
      });
  };

  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({type:"UPDATE", payload:{following:data.following, followers:data.followers}})
        localStorage.setItem("user", JSON.stringify(data))
        setProfile((prevState)=>{
          const newFollower = prevState.user.followers.filter(item=>item != data._id)
          return {
            ...prevState,
            user:{
              ...prevState.user,
              followers:newFollower
            }
          }
        })
        setShowFollow(true)

      });
  };
  return (
    <>
      {userProfile ? (
        <div className="profile-container">
          <div className="profile-title-container profile-title">
            <div>
              <img 
                className="profile-avatar"
                src={userProfile.user.pic}
              />
            </div>
            <div>
              <h5>{userProfile.user.name}</h5>
              <h6>{userProfile.user.email}</h6>

              <div className="profile-detail">
                <h6><span className="text-bold">{userProfile.posts.length}</span> posts</h6>
                <h6 data-target="modal4" className=" modal-trigger"><span className="text-bold">{userProfile.user.followers.length}</span> followers</h6>
                <h6 data-target="modal5" className=" modal-trigger"><span className="text-bold">{userProfile.user.following.length}</span> following</h6>
              </div>
              {showFollow?
                <button
                  style={{
                    margin:"10px 0px"
                  }}
                  className="btn waves-effect waves-light #64b5f6 blue darken-1"
                  onClick={() => followUser()}
                >
                  Follow
                </button>
                :
                <button
                  style={{
                    margin:"10px 0px"
                  }}
                  className="btn waves-effect waves-light #64b5f6 blue darken-1"
                  onClick={() => unfollowUser()}
                >
                  Unfollow
                </button>
              }
              
              
            </div>

        <div id="modal4" className="modal" ref={followingModalu} style={{color:"black"}}>
        <div className="modal-content">
        kkkkkkkkkkkk
        </div>
        <div className="modal-footer">
          <button className="modal-close waves-effect waves-green btn-flat" >close</button>
        </div>
      </div>

      <div id="modal5" className="modal" ref={followedModalu} style={{color:"black"}}>
        <div className="modal-content">
        kkkkkkkkkfff
        </div>
        <div className="modal-footer">
          <button className="modal-close waves-effect waves-green btn-flat" >close</button>
        </div>
      </div>

          </div>
          <div className="gallery">
            {userProfile.posts.map((item) => {
              return (
                <img
                  key={item._id}
                  className="item profile-post"
                  src={item.photo}
                  alt={item.title}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <h2>loading...</h2>
      )}
    </>
  );
};

export default UserProfile;
