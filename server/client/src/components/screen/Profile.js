import React, { useEffect, useState, useContext,useRef } from "react";
import {UserContext} from '../../App'
import {Link } from 'react-router-dom'
import ModalImage from 'react-modal-image'
import M from 'materialize-css'
const Profile = () => {
  const  followingModal = useRef(null)
  const  followedModal = useRef(null)
  const  changeName = useRef(null) 
  const [data, setData] = useState([]);
  const {state, dispatch} = useContext(UserContext);
  const [image,setImage]=useState("");
  const [newName, setNewName] = useState("");

  useEffect(()=>{
    M.Modal.init(followingModal.current)
    M.Modal.init(followedModal.current)
    M.Modal.init(changeName.current)
  },[])

  useEffect(() => {
    fetch("/mypost", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result)
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

  const updateName = () => {
    if(newName){
      fetch("/updatename",{
        method:"put",
        headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer " +localStorage.getItem("jwt")
        },
        body:JSON.stringify({name:newName })
      }).then(res=>res.json())
      .then(result=>{
        //console.log(result)
        localStorage.setItem("user",JSON.stringify({...state,name:result.name}))
        dispatch({type:"UPDATENAME",payload:result.name})
        window.location.reload()

      })
    }
  }

  const updatePhoto=(file)=>{
    setImage(file)
  }
  
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
          <h5>{state?state.name:"loading..."} 
            <i
              className="material-icons modal-trigger"
              data-target="modal4"
              style={{color:"black", marginLeft:"0.5rem"}}
            >
              edit
            </i> 
          </h5>
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

      <div id="modal4" className="modal" ref={changeName} style={{color:"black"}}>
        <div className="modal-content" style={{textAlign:"center", paddingBottom:"0"}}>
        <h5 style={{textAlign:"center"}}>Change your name</h5>
        <input id='newName' type="text" placeholder="Your new name" value={newName} onChange={(e)=>{setNewName(e.target.value)}}/>
        <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
         onClick={()=>updateName()}
        >
          Change
        </button>
        </div>
        <div className="modal-footer">
          <button className="modal-close waves-effect waves-green btn-flat" >close</button>
        </div>
      </div>

        </div>
      <div className="gallery" >
        {data.map((item) => {
          // return <img key={item._id} className="item profile-post" src={item.photo} alt={item.title}/>
          return <ModalImage imageBackgroundColor="white" hideDownload='true' hideZoom='true' showRotate='true' small={item.photo} large={item.photo} alt={item.title} className="item profile-post"/>
        })}
      </div>
    </div>
  );
};

export default Profile;
