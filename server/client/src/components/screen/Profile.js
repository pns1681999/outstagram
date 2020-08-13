import React, { useEffect, useState, useContext,useRef } from "react";
import {UserContext} from '../../App'
import {Link } from 'react-router-dom'
import ModalImage from 'react-modal-image'
import M from 'materialize-css'
import { model } from "mongoose";
const Profile = () => {
  const  followingModal = useRef(null)
  const  followedModal = useRef(null)
  const  ImageModal = useRef(null)

  const [data, setData] = useState([]);
  const {state, dispatch} = useContext(UserContext);
  const [image,setImage]=useState("");
  const [modalImage, setModalImage]=useState("");
  const [modalBody, setModalBody]=useState("");
  const [modalTitle, setModalTitle]=useState("");
  const [modalComment, setModalComment]=useState([]);
  const [modalLike, setModalLike]=useState([]);
  const [modalPostedby,setmodalPostedby]=useState({pic:'',name:''});
  const [modalId, setModalId]=useState("");



  useEffect(()=>{
    M.Modal.init(followingModal.current)
    M.Modal.init(followedModal.current)
    M.Modal.init(ImageModal.current)
  },[])
 
  useEffect(() => {
    fetch("/mypost", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        
        setData(result.myposts);
        
      });
  }, []);

  useEffect(()=>{
    
    if(image)
    {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "outsta");
    data.append("cloud_name", "pns1681999");
    fetch("https://api.cloudinary.com/v1_1/pns1681999/image/upload",{
      method:"post",
      body:data
    })
    .then(res=>res.json())
    .then(data=>{
      fetch("/updatepic",{
        method:"put",
        headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer " +localStorage.getItem("jwt")
        },
        body:JSON.stringify({pic:data.url })
      }).then(res=>res.json())
      .then(result=>{
        //console.log(result)
        localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
        dispatch({type:"UPDATEPIC",payload:result.pic})
        window.location.reload()

      })
    })
    .catch(err=>{
      console.log(err)
    })
    }
  },[image]);

  const updatePhoto=(file)=>{
    setImage(file)
  }

  const handleSetImage = (url,comments,likes,title,body,postedBy,id)=>{

    setModalImage(url);
    setModalComment(comments);
    setModalLike(likes);
    setModalTitle(title);
    setModalBody(body);
    setmodalPostedby({...modalPostedby,name:postedBy.name,pic:postedBy.pic})
    setModalId(id);
    
  
  }
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
    <div className="profile-container">
      
    <div  className="profile-title-container">
      <div className="profile-title">
        <div style={{position:"relative"}}>
          <img
            className="profile-avatar"
            src={state?state.pic:"loading"}
          />
          <div className="file-field input-field profile-addbtn-container" >
            {/* <div className="btn #64b5f6 blue darken-1">
              <span>Update pic</span>
              <input type="file" multiple onChange={(e)=>updatePhoto(e.target.files[0])}/>
            </div> */}
            <i className="material-icons profile-addbtn">
              add_circle
              <input type="file" multiple onChange={(e)=>updatePhoto(e.target.files[0])}/>
            </i>
            {/* <div className="file-path-wrapper">
              <input
                className="file-path validate"
                type="text"
                placeholder="Upload one or more files"
              />
            </div> */}
          </div>
         
        </div>
        <div>
          <h5>{state?state.name:"loading..."}</h5>
          <h6>{state?state.email:"loading..."}</h6>

          <div className="profile-detail">
            <h6><span className="text-bold">{data.length}</span> posts</h6>
            <h6 data-target="modal2" className=" modal-trigger can-click"><span className="text-bold">{state?state.followers.length:"0"}</span> followers</h6>
            <h6 data-target="modal3" className=" modal-trigger can-click"><span className="text-bold">{state?state.following.length:"0"}</span> following</h6>
          </div>
        </div>
      </div>
      
      
      

      <div id="modal2" className="modal" ref={followedModal} style={{color:"black"}}>
        <div className="modal-content">
      
                <h5 style={{textAlign:"center"}}>Followers</h5>

                
                {state?state.followers.map((item) => {
                //console.log(state)
                return   <Link key={item._id} to={item._id !== state._id ? "/profile/"+item._id:'/profile'} onClick={()=>{
                  M.Modal.getInstance(followedModal.current).close()
                }}>
                  <div className="collection-item">
                    <img
                      className="profile-follow-avatar"
                      src={item.pic}
                    />
                    <span className="text-bold"> {item.name} </span>
                  </div></Link> 
                }):""}

        </div>
        <div className="modal-footer">
          <button className="modal-close waves-effect waves-green btn-flat" >close</button>
        </div>
      </div>

      <div id="modal3" className="modal" ref={followingModal} style={{color:"black"}}>
        <div className="modal-content">
        <h5 style={{textAlign:"center"}}>Following</h5>
                {state?  state.following.map((item) => {
                return  <Link key={item._id} to={item._id !== state._id ? "/profile/"+item._id:'/profile'} onClick={()=>{
                  M.Modal.getInstance(followingModal.current).close()
                }}>
                  <div className="collection-item">
                    <img
                      className="profile-follow-avatar"
                      src={item.pic}
                    />
                    <span className="text-bold"> {item.name} </span>
                  </div></Link> 
                }):<h6>No following.</h6>}
        </div>
        <div className="modal-footer">
          <button className="modal-close waves-effect waves-green btn-flat" >close</button>
        </div>
      </div>

      <div id="modal5" className="modal" ref={ImageModal} style={{color:"black",overflow: "hidden" }}>
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

        </div>
      <div className="gallery" >
        {data.map((item) => {
           return <img key={item._id} className="item profile-post modal-trigger" data-target="modal5" src={item.photo} alt={item.title} onClick={() => handleSetImage(item.photo,item.comments,item.likes,item.title,item.body,item.postedBy,item._id)} alt={item.tit} />
          // return  <ModalImage imageBackgroundColor="white" hideDownload='true' hideZoom='true' showRotate='true' small={item.photo} large={item.photole} className="item profile-post"/>
        })}
      </div>
    </div>
  );
};

export default Profile;
