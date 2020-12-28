
import './App.css';
import logo from './assets/SmallIconLogo.png';
import Post from './Post';
function App() {
  return (
    <div className="App">
      
      
      {/* Room for Header */} 
      <div className="app__header"><img
        className="app__headerImage"
        src={logo}
        alt="AppIconImage"
      /></div>
   
      <h1> Hello World! </h1>
      {/* Room for Posts */}
      <Post>


        
      </Post>



      {/* Room for Posts */}


    </div>
  );
}

export default App;
