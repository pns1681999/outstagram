import React, { useState,useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

const Signup = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image,setImage]=useState("");
  const [url,setUrl]=useState(undefined);
  useEffect(()=>{
    if(url)
    {
      uploadFields()
    }

  },[url])
  const uploadpic=()=>{
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
  const uploadFields=()=>{
    if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
      M.toast({ html: "invalid email", classes: "#d32f2f red darken-2" });
      return;
    }
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        password,
        email,
        pic:url
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#d32f2f red darken-2" });
        } else {
          M.toast({ html: data.message, classes: "#388e3c green darken-2" });
          history.push("/signin");
        }
      }).catch(err=>{
        console.log(err);
      });
  }
  const postData = () => {
    if(image)
    {
      uploadpic()
    }else{
      uploadFields()
    }
  };

  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Outstagram</h2>
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="file-field input-field">
        <div className="btn #64b5f6 blue darken-1">
          <span>Upload Image</span>
          <input type="file" multiple onChange={(e)=>setImage(e.target.files[0])}/>
        </div>
        <div className="file-path-wrapper">
          <input
            className="file-path validate"
            type="text"
            placeholder="Avatar image"
          />
        </div>
      </div>

        <button
          className="login-btn btn waves-effect waves-light #64b5f6 blue darken-1"
          onClick={() => postData()}
        >
          Sign up
        </button>
        
      </div>
      <div className="card auth-card input-field">
        <h6>
        Already have an account? <Link to="/signin" className="blue-link">Sign in</Link>
        </h6>
      </div>
    </div>
  );
};

export default Signup;
