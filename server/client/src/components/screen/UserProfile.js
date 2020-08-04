import React,{useContext,useRef,useEffect,useState} from 'react'
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";
import {Link} from 'react-router-dom';
import M from 'materialize-css';
const UserProfile = () => {
  const  followingModalu = useRef(null)
  const  followedModalu = useRef(null)

  useEffect(()=>{
    M.Modal.init(followingModalu.current)
    M.Modal.init(followedModalu.current)
  },[])

  const [userProfile, setProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();

  //console.log(userid)

  const [showFollow,setShowFollow] = useState((state ? ()=>{
    var found = true;
    for(var i = 0; i < state.following.length; i++) {
        if (state.following[i]._id == userid) {
            found = false;
            break;
        }
    }
    return found;
  }:true));

  useEffect(()=>{
    if (state) {
        var found = true;
        for(var i = 0; i < state.following.length; i++) {
            if (state.following[i]._id == userid) {
                found = false;
                break;
            }
        }
        setShowFollow(found);
  }}, [state]);


  

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
  }, [userid]);

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
              followers:[...prevState.user.followers,{pic:data.pic, _id: data._id, name:data.name}]
            }
          }
        })
        //console.log(userProfile)
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
        // console.log(data);
        dispatch({type:"UPDATE", payload:{following:data.following, followers:data.followers}})
        localStorage.setItem("user", JSON.stringify(data))
        setProfile((prevState)=>{
          const newFollower = prevState.user.followers.filter(item=>item._id != data._id)
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
              <Link to="/profile/5efeb2d9ec69f00d5c81a3a2">
              <img 
                className="profile-avatar"
                src={userProfile.user.pic}
              />
              </Link>
            </div>
            <div>
              <h5>{userProfile.user.name}</h5>
              <h6>{userProfile.user.email}</h6>

              <div className="profile-detail">
                <h6><span className="text-bold">{userProfile.posts.length}</span> posts</h6>
                <h6 data-target="modal4" className="modal-trigger can-click"><span className="text-bold">{userProfile.user.followers.length}</span> followers</h6>
                <h6 data-target="modal5" className="modal-trigger can-click"><span className="text-bold">{userProfile.user.following.length}</span> following</h6>
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
       <div id="modal4" className="modal" ref={followedModalu} style={{color:"black"}}>
          <div className="modal-content">
      
                <h5 style={{textAlign:"center"}}>Followers</h5>
                {userProfile?userProfile.user.followers.map((item) => {
                  return   <Link key={item._id} to={item._id !== state._id ? '/profile/'+item._id:'/profile'} onClick={()=>{
                    M.Modal.getInstance(followedModalu.current).close()
                  }}>
                    <div className="collection-item">
                      <img
                        className="profile-follow-avatar"
                        src={item.pic}
                      />
                      <span className="text-bold"> {item.name} </span>
                    </div></Link> 
                  }):""
                }

          </div>
          <div className="modal-footer">
            <button className="modal-close waves-effect waves-green btn-flat" >close</button>
          </div>
      </div>

      <div id="modal5" className="modal" ref={followingModalu} style={{color:"black"}}>
        <div className="modal-content">
          <h5 style={{textAlign:"center"}}>Following</h5>
                {userProfile?  userProfile.user.following.map((item) => {
                return  <Link key={item._id} to={item._id !== state._id ? '/profile/'+item._id:'/profile'} onClick={()=>{
                  M.Modal.getInstance(followingModalu.current).close()
                }}>
                  <div className="collection-item">
                    <img
                      className="profile-follow-avatar"
                      src={item.pic}
                    />
                    <span className="text-bold">{item.name} </span>
                  </div></Link> 
                }):<h6>No following.</h6>}
        </div>
        <div className="modal-footer">
          <button className="modal-close waves-effect waves-green btn-flat" >close</button>
        </div>
      </div>
    </>

  );
};

export default UserProfile;
