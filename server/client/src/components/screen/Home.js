import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../../App";
import LazyLoad from "react-lazyload";
import { Link } from "react-router-dom";
import M from "materialize-css";

const Home = () => {
  const [data, setData] = useState([]);
  //const [likes, setLikes] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  //const likesModal = useRef(null);

  // useEffect(() => {
  //   M.Modal.init(likesModal.current);
  // }, []);
  const editPost = useRef(null)
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [modalPostId, setmodalPostId] = useState("");
  useEffect(() => {
    fetch("/allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setData(result.posts);
      });
  }, []);
  useEffect(()=>{
    M.Modal.init(editPost.current)
  },[]);
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

  const deletePost = (postId) => {
    fetch(`/deletepost/${postId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleEditPost = (id) =>{
    setmodalPostId(id);
  }
  const updatePost = (postId) => {
    if(newTitle || newBody){
     
    fetch(`/updatepost/${postId}`, {
      method: "put",
      headers: {
        "Content-Type":"application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body:JSON.stringify ({
        title:newTitle,
        body:newBody
      })
    })
      .then((res) => res.json())
      .then((result) => {
        window.location.reload()
        console.log(result)
      })    
   }
  };
  return (
    <div className="home">
      {data.map((item,index) => {
        return (
          <LazyLoad  height={100}  debounce={100}>
          <div className="card home-card" key={item._id}>
            <h5 className="post-title-container">
              <div className="post-title-avatar-postedBy">
                <img src={item.postedBy.pic} className="post-title-avatar" />
                <Link
                  to={
                    item.postedBy._id != state._id
                      ? "/profile/" + item.postedBy._id
                      : "/profile"
                  }
                  className="post-title-postedBy"
                >
                  {item.postedBy.name}
                </Link>
              </div>
              {item.postedBy._id == state._id && (
                <i
                  className="material-icons"
                  style={{ float: "right" }}
                  onClick={() => deletePost(item._id)}
                >
                  delete_outline
                </i>
              )}
              {item.postedBy._id == state._id && (
                  <i
                    className="material-icons modal-trigger"
                    data-target="modal2"
                    style={{float:"right", color:"black", marginLeft:"0.5rem"}}
                    onClick={()=> setmodalPostId(item._id)}
                  >
                    edit
                  </i> 
              )}

            </h5>

            <div className="card-image ">
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
                {/* <h6
                  data-target="modal-like"
                  className="modal-trigger text-bold"
                  onClick ={()=>{setLikes(item.likes); console.log(likes)}}
                >
                  {item.likes.length} likes
                </h6> */}
                <h6
                  className="text-bold"
                >
                  {item.likes.length} likes
                </h6>
                
              </div>

              <h6>
                <span className="text-bold">{item.postedBy.name} </span>
                {item.title}
              </h6>
              <p>{item.body}</p>
              {item.comments.map((record) => {
                return (
                  <h6 key={record._id}>
                    <span style={{ fontWeight: "500" }}>
                      {record.postedBy.name}{" "}
                    </span>
                    {record.text}
                  </h6>
                );
              })}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (e.target[0].value) {
                    makeComment(e.target[0].value, item._id);
                    e.target[0].value = null;
                  }
                }}
              >
                <input type="text" placeholder="add a comment" />
              </form>
            </div>
          </div>
          </LazyLoad>
        );
      })}
        <div id="modal2" className="modal" ref={editPost} style={{color:"black"}}>
        <div className="modal-content" style={{paddingBottom:"0"}}>
        <h5>Change your title</h5>
        <input id='newTitle' type="text" placeholder="Your new title" value={newTitle} onChange={(e)=>{setNewTitle(e.target.value)}}/>
        <h5>Change your body</h5>
        <input id='newBody' type="text" placeholder="Your new body" value={newBody} onChange={(e)=>{setNewBody(e.target.value)}}/>
        <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
         style={{left:"43%"}}
         onClick={()=>updatePost(modalPostId)}
        >
          Change
        </button>
        </div>
        <div className="modal-footer">
          <button className="modal-close waves-effect waves-green btn-flat" >close</button>
        </div>
      </div>
      {/* <div
        id=  "modal-like"
        className="modal"
        ref={likesModal}
        style={{ color: "black" }}
      >
        <div className="modal-content">
          <h6>{likes ? likes.length : "Nobody like this post!"}</h6>
          {likes
            ? likes.map((i) => {
                return (
                  <Link
                    to={
                      i !== state._id
                        ? "/profile/" + i
                        : "/profile"
                    }
                    onClick={() => {
                      M.Modal.getInstance(likesModal.current).close();
                    }}
                  >
                    <li key={i} className="collection-item">{i}</li>
                  </Link>
                );
              })
            : ""}
        </div>
        <div className="modal-footer">
          <button className="modal-close waves-effect waves-green btn-flat">
            close
          </button>
        </div>
      </div> */}
                
    </div>
  );
};

export default Home;
