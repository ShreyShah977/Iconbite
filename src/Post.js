/* Image - Post component */
import React from 'react';
import './Post.css';
import Avatar from "@material-ui/core/Avatar";
function Post() {
    return (
        <div className="post">
            <div className="post__header">
              <Avatar
                  className="post__avatar"
                  alt='ShreyShah'
                  src="/static/images/avatar/1.jpg"          
              />
              {/* Header contains both user name and profile icon/avatar */}
              <h4>Username</h4>
            </div>
            
          
            {/** img itself */}
            <img
            className="post__img"
            src="https://torontofamilydoulas.com/wp-content/uploads/2019/12/top-10-holiday-activities-2019.png"
            alt=""

            ></img>       
            <h4 className="post__text"><strong>UserName</strong>    TagLine</h4>
            {/** username  + tagline*/}             
        </div>
    )
}

export default Post
