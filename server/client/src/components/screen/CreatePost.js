import React, {useState, useEffect} from "react";
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'

const CreatePost = () => {
  const history = useHistory();
  const [title,setTitle] = useState("");
  const [body,setBody] = useState("");
  const [image,setImage] = useState("");
  const [url,setUrl] = useState("");
  useEffect(()=>{
    if(url){
      fetch('/createpost', {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwt")
        },
        body: JSON.stringify({
          title,
          body,
          photo:url,
  
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          if (data.error) {
            M.toast({ html: data.error, classes: "#d32f2f red darken-2" });
          } else {
            M.toast({ html: "Created post success", classes: "#388e3c green darken-2" });
            history.push("/");
          }
        }).catch(err=>{
          console.log(err);
        });
    }
  },[url])

  const postDetails = () =>{
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
      setUrl(data.url)
    })
    .catch(err=>{
      console.log(err)
    })

    
  }


  return (
    <div className="card input-field card-create-post">
      <input type="text" placeholder="title" value={title} onChange={(e)=>setTitle(e.target.value)}/>
      <input type="text" placeholder="status" value={body} onChange={(e)=>setBody(e.target.value)}/>
      <div className="file-field input-field">
        <div className="btn #64b5f6 blue darken-1">
          {/* <span>Upload Image</span> */}
          <i className="material-icons">
            cloud_upload
            </i>
          <input type="file" multiple onChange={(e)=>setImage(e.target.files[0])}/>
        </div>
        <div className="file-path-wrapper">
          <input
            className="file-path validate"
            type="text"
            placeholder="Upload one or more files"
          />
        </div>
      </div>

      <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
      onClick={()=>postDetails()}
      >
        Submit post
      </button>
    </div>
  );
};

export default CreatePost;
