import React,{useContext,useRef,useEffect,useState} from 'react'
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";
import LazyLoad from "react-lazyload";
import ModalImage from 'react-modal-image';
import {Link} from 'react-router-dom';
import Error404 from "./Error404"
import M from 'materialize-css';
const UserProfile = () => {
  const  followingModalu = useRef(null)
  const  followedModalu = useRef(null)
  const  ImageModal = useRef(null)
  useEffect(()=>{
    M.Modal.init(followingModalu.current)
    M.Modal.init(followedModalu.current)
    M.Modal.init(ImageModal.current)

  },[])
  const [data, setData] = useState([]);
  const [userProfile, setProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [image,setImage]=useState("");
  const [modalImage, setModalImage]=useState("");
  const [modalBody, setModalBody]=useState("");
  const [modalTitle, setModalTitle]=useState("");
  const [modalComment, setModalComment]=useState([]);
  const [modalLike, setModalLike]=useState([]);

  const [modalId, setModalId]=useState("");
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
        console.log(result);
        setData(result.posts);
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

  const handleSetImage = (url,comments,likes,title,body,id)=>{

    setModalImage(url);
    setModalComment(comments);
    setModalLike(likes);
    setModalTitle(title);
    setModalBody(body);
    setModalId(id);
    
  
  };
  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text,
        postId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result)
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result)
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      ({userProfile ?(!userProfile.hasOwnProperty('error')?(
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
                <h6><span className="text-bold">{data.length}</span> posts</h6>
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
            {data.map((item,index) => {
              return <img key={item._id} className="item profile-post modal-trigger" data-target="modal6" src={item.photo} alt={item.title} onClick={() => handleSetImage(item.photo,item.comments,item.likes,item.title,item.body,item._id)} alt={item.tit} />

            })}
          </div>
          
        </div>
      ): (<Error404/>) ): (
        <h2>loading...</h2>
      )}
       <div id="modal4" className="modal" ref={followedModalu} style={{color:"black"}}>
          <div className="modal-content">
      
                <h5 style={{textAlign:"center"}}>Followers</h5>
                {userProfile&&!userProfile.hasOwnProperty('error')?userProfile.user.followers.map((item) => {
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
                {userProfile&&!userProfile.hasOwnProperty('error')?  userProfile.user.following.map((item) => {
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

      <div id="modal6" className="modal" ref={ImageModal} style={{color:"black",overflow: "hidden" }}>
        <div class="modal-content">
          <div style={{ display:'flex', alignItems: 'center'  }}>
           <img  style={{ flex: 3  }} src={modalImage}  alignItems="center" height="500px" width="100px" />
            <div style={{ flex: 1, overflow:"auto", height:"500px" ,padding: "5px"}} >
              <div style={{borderBottom: "solid 1px #00000036"}}>
              <h6><span>{modalBody}</span></h6>
              <h6><b>{state?state.name:"loading..."}:</b><span>{modalTitle}</span></h6>  
            </div>
          <div className="example">
                { modalComment.map((item)=>{
                return(
                <h6 ><span style={{ fontWeight: "500" }} className="text-bold">
                  {item.postedBy.name}{" "}
                </span>
                  {item.text}
              </h6>);
                }) }
            </div>  
              <div className="like-container">
                  {modalLike.includes(state?state._id:null) ? (
                      <i
                        className="material-icons"
                        style={{ color: "red" ,paddingTop: "1px" }}
                        onClick={() => unlikePost(modalId)}>
                        favorite
                      </i>
                    ):(
                      <i
                        className="material-icons"
                        onClick={() => likePost(modalId)}>
                        favorite_border
                      </i>
                    )}
                  <h6 className="text-bold">
                  {modalLike.length} likes
                  </h6>
                
               
                
              </div>
              <form onSubmit={(e) => {
                  e.preventDefault();
                  if (e.target[0].value) {
                    makeComment(e.target[0].value, modalId);
                    e.target[0].value = null;
                  } }}>
                <input type="text" placeholder="add a comment" />
              </form>
              </div>
            
          </div>
        </div>
      </div>
      
    </>

  );
};

export default UserProfile;
