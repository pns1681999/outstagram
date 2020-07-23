import React, { useEffect, useState, useContext,useRef } from "react";
import {UserContext} from '../../App'
import {Link } from 'react-router-dom'
import M from 'materialize-css'
const Profile = () => {
  const  followingModal = useRef(null)
  const  followedModal = useRef(null)
  const [data, setData] = useState([]);
  const {state, dispatch} = useContext(UserContext);
  const [image,setImage]=useState("");

  useEffect(()=>{
    M.Modal.init(followingModal.current)
    M.Modal.init(followedModal.current)
  },[])

  useEffect(() => {
    fetch("/mypost", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
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
        console.log(result)
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
  return (
    <div style={{ maxWidth: "550px", margin: "0px auto" }}>
      
    <div  style={{
         
          margin: "18px 0px",
          borderBottom: "1px solid grey",
        }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <div>
          <img
            style={{ width: "160px", height: "160px", borderRadius: "80px", objectFit:"cover" }}
            src={state?state.pic:"loading"}
          />
         
        </div>
        <div>
          <h4>{state?state.name:"loading..."}</h4>
          <h5>{state?state.email:"loading..."}</h5>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "108%",
            }}
          >
            <h5>{data.length} posts</h5>
            <h5 data-target="modal2" className=" modal-trigger">{state?state.followers.length:"0"} followers</h5>
            <h5 data-target="modal3" className=" modal-trigger">{state?state.following.length:"0"} following</h5>
          </div>
        </div>
      </div>
      
      
      <div className="file-field input-field" style={{margin:"10px"}}>
        <div className="btn #64b5f6 blue darken-1">
          <span>Update pic</span>
          <input type="file" multiple onChange={(e)=>updatePhoto(e.target.files[0])}/>
        </div>
        <div className="file-path-wrapper">
          <input
            className="file-path validate"
            type="text"
            placeholder="Upload one or more files"
          />
        </div>
      </div>

      <div id="modal2" className="modal" ref={followedModal} style={{color:"black"}}>
        <div className="modal-content">
      
                <h6>{state?state.followers.length:"0"}</h6>
                {state?state.followers.map((item) => {
                return   <Link to={item._id !== state._id ? "/profile/"+item._id:'/profile'} onClick={()=>{
                  M.Modal.getInstance(followedModal.current).close()
                }}>
                  <li className="collection-item">{item.name}</li></Link> 
                }):""}

        </div>
        <div className="modal-footer">
          <button className="modal-close waves-effect waves-green btn-flat" >close</button>
        </div>
      </div>

      <div id="modal3" className="modal" ref={followingModal} style={{color:"black"}}>
        <div className="modal-content">
        <h6>{state?state.following.length:"0"}</h6>
                {state?state.following.map((item) => {
                return  <Link to={item._id !== state._id ? "/profile/"+item._id:'/profile'} onClick={()=>{
                  M.Modal.getInstance(followingModal.current).close()
                }}>
                  <li className="collection-item">{item.name}</li></Link> 
                }):""}
        </div>
        <div className="modal-footer">
          <button className="modal-close waves-effect waves-green btn-flat" >close</button>
        </div>
      </div>

        </div>
      <div className="gallery" >
        {data.map((item) => {
          return <img key={item._id} className="item" src={item.photo} alt={item.title} />;
        })}
      </div>
    </div>
  );
};

export default Profile;
