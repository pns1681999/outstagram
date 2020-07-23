import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import {Link} from 'react-router-dom';
const SubscriberUserPost = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch("/getsubpost", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result);
        setData(result.posts);
      });
  }, []);

  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt"),
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

  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt"),
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

  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt"),
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

  const deletePost = (postId)=>{
    fetch(`/deletepost/${postId}`,{
      method: "delete",
      headers:{
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
    }).then(res=>res.json())
    .then(result=>{
      console.log(result)
      const newData = data.filter(item=>{
        return item._id !== result._id
      })
      setData(newData)
    }).catch(error=>{
      console.log(error)
    })
  }

  return (
    <div className="home">
      {data.map((item) => {
        return (
          <div className="card home-card" key={item._id}>
            <h5 className="post-title-container"> 
              <div className="post-title-avatar-postedBy">  
                <img src={item.postedBy.pic} className="post-title-avatar"/> 
                <Link to={item.postedBy._id!=state._id?'/profile/'+item.postedBy._id : '/profile'} className="post-title-postedBy">
                  {item.postedBy.name}
                </Link> 
              </div>
              {
                item.postedBy._id==state._id &&
                <i
                    className="material-icons"
                    style={{ float: "right" }}
                    onClick={() => deletePost(item._id)}
                  >
                    delete
                </i>
              }
            </h5>
            
            <div className="card-image">
              <img src={item.photo} />
            </div>
            <div className="card-content post-content">
              <div className="like-container">
                {item.likes.includes(state._id) ? (
                  <i
                    className="material-icons"
                    style={{ color: "red" }}
                    onClick={() => unlikePost(item._id)}
                  >
                    favorite
                  </i>
                ) : (
                  <i
                    className="material-icons"
                    onClick={() => likePost(item._id)}
                  >
                    favorite_border
                  </i>
                )}

                <h6 className="text-bold">{item.likes.length} likes</h6>
              </div>
              <h6><span className="text-bold">{item.postedBy.name} </span>{item.title}</h6>
              <p>{item.body}</p>
              {
                item.comments.map(record=>{
                  return(
                  <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}  </span>{record.text}</h6>
                  )
                })
              }
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (e.target[0].value){
                    makeComment(e.target[0].value, item._id);
                    e.target[0].value=null;
                  }
                }}
              >
                <input type="text" placeholder="add a comment" />
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SubscriberUserPost;
