
import './App.css';
import logo from './assets/SmallIconLogo.png';
import Post from './Post';
import React, { useState, useEffect } from  'react';
import { db, auth, storage } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal'
import { Button, Input } from '@material-ui/core';

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
    backgroundColor: theme.palette.background.paper,
    border: '2px solid lightseagreen',
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
    db.collection('posts').onSnapshot(snapshot => {
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
    <div className="App">
      
      
      {/* Room for Header */} 
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
            <Button type="submit" onClick={registerUser}> Register </Button>
           
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
            <Button type="submit" onClick={signIn}> Login </Button>
           
          </form>
        </div>
      
      </Modal>
      <div className="app__header"><img
        className="app__headerImage"
        src={logo}
        alt="AppIconImage"
      /></div>
      {user ? (
        <Button onClick={()=> auth.signOut()}>Logout</Button>
      ):(
        <div className="app_loginContainer">
        <Button onClick={()=> setOpen(true)}>Register</Button>
        <Button onClick={()=> setOpenSignIn(true)}>Sign In</Button>
        </div>
      )}

      <h1> Welcome Back! </h1>
      {/* Room for Posts */}
      {
        posts.map(({id, post}) => (
          <Post key={id}  username = {post.username} tagLine = {post.tagLine} imageSrc = {post.imageSrc}> </Post>
        ))
      }

      {/* Room for Posts */}


    </div>
  );
}

export default App;
