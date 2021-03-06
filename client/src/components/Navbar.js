import React, { useContext ,useRef,useEffect} from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import M from 'materialize-css'
const NavBar = () => {
  const searchModal=useRef(null)
  const {search,setSearch}=useState('')
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  useEffect(()=>{
    M.Modal.init(searchModal.current)
  },[])
  const renderList = () => {
    if (state) {
      return [
        <li key="1"> <i data-target="modal1" className="large material-icons modal-trigger" style={{color:"black"}}>search</i></li>,
        <li key="2">
          <Link to="/profile">Profile</Link>
        </li>,
        <li key="3">
          <Link to="/create">Create Post</Link>
        </li>,
        <li key="4">
          <Link to="/myfollowingpost">My following Posts</Link>
        </li>,
        <li key="5">
          <button
            className="btn #c62828 red darken-3"
            onClick={() => {
              localStorage.clear();
              dispatch({type:"CLEAR"})
              history.push('/signin')

            }}
          >
            Logout
          </button>
        </li>,
      ];
    } else {
      return [
        <li key="6">
          <Link to="/signin">Sign In</Link>
        </li>,
        <li key="7">
          <Link to="/signup">Sign Up</Link>
        </li>,
      ];
    }
  };
  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? "/" : "/signin"} className="brand-logo left">
          Outstagram
        </Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
      <div id="modal1" class="modal" ref={searchModal} style={{color:"black"}}>
        <div className="modal-content">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}

        />
        <ul className="collection">
          <li className="collection-item">Alvin</li>
          <li className="collection-item">Alvin</li>
          <li className="collection-item">Alvin</li>
          <li className="collection-item">Alvin</li>
        </ul>
        </div>
        <div className="modal-footer">
          <button className="modal-close waves-effect waves-green btn-flat">Agree</button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
