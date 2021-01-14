
import './App.css';
import logo from './assets/IconBiteLogo.png';
import Post from './Post';
import React, { useState, useEffect } from  'react';
import { db, auth, storage } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal'
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: '#FAFAFA',
    border: '2px solid white',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false); 

  const [openSignIn, setOpenSignIn] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [user, setCurrentUser] = useState('null');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser){
      // Assume individual has logged in.
        console.log(authUser);
        setCurrentUser(authUser);

      } else {
      // Individual has NOT logged in.
        setCurrentUser(null);
      }

    })

    return () => {
      // Garbage collection of this instance.
      unsubscribe();
    }

  }, [user,username]);




  // UseEffect, running a piece of code based on our specific condition
  // Runs once when the app component loads, but "reacts" to when posts change.
  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      // Snapshotting everytime a new update/post is made.
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id, 
        post: doc.data()
      })));
    });
  }, []);
  
  const registerUser = (event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
       return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));
    setOpen(false);
  }
  const signIn = (event) => {
    event.preventDefault();
    auth
    .signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message));


    setOpenSignIn(false);

  }

  return (
    <div className="app">  
     
      {/* Sign Up Component */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
            <img
              className="app__signupImage"
              src={logo}
              alt="AppIconImage"
            />
            </center>
            <Input
              placeholder="Username "
              type="text"
              value={username}
              onChange={(e)=> setUsername(e.target.value)}
            />
            <Input
              placeholder="Email "
              type="text"
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
            />
            <Input
              placeholder="Password "
              type="password"
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
            />
            <Button type="submit" onClick={registerUser}><p className='app_Login_Button'>Register</p></Button>
           
          </form>
        </div>
      
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
            <img
              className="app__signupImage"
              src={logo}
              alt="AppIconImage"
            />
            </center>
            <Input
              placeholder="Email "
              type="text"
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
            />
            <Input
              placeholder="Password "
              type="password"
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}><p className='app_Login_Button'>Login</p> </Button>
           
          </form>
        </div>
      
      </Modal>
      {/* Room for Header */} 
      <div className="app__header"><img
        className="app__headerImage"
        src={logo}
        alt="AppIconImage"
      />
      {user ? (
        <Button onClick={()=> auth.signOut()}><p className='app_Login_Button'>Log Out</p></Button>
      ):(
        <div className="app_loginContainer">
          <Button onClick={()=> setOpen(true)}><p className='app_Login_Button'>Register</p></Button>
          <Button onClick={()=> setOpenSignIn(true)}><p className='app_Login_Button'>Sign In</p></Button>
        </div>
      )} 
      
      </div>
      

      <div className="app__postsContainer">
      {/* Room for Posts */}
      {
        posts.map(({id, post}) => (
          <Post key={id}  username = {post.username} tagLine = {post.tagLine} imageSrc = {post.imageSrc}> </Post>
        ))
      }
      </div>

      {/* Room for Posts */}

      
    {user?.displayName ? (
      <ImageUpload username={user.displayName}>

      </ImageUpload>  
    ): (    

      <h5>Please Login to Upload</h5>

    )}
         
    </div>
  );
}

export default App;
