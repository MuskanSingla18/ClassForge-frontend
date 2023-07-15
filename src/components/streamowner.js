import React, { useState,useEffect } from 'react';
import axios from 'axios';
import PostCard from './postcardowned';
import PopupComponent from './popuptoupdateclass';
const StreamComponent = (props) => {

  // console.log(props);
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);

  const [showPopup, setShowPopup] = useState(false); // State to toggle the visibility of the popup

// console.log(posts);
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send the content to the server
    try {
        const response = await axios.post(`${process.env.REACT_APP_PATH_URL}/class/${props.classData._id}/feed`, { content },{
        withCredentials: true,
      });
      // Update the posts state with the new post data at the beginning
      console.log(response);
    setPosts([response.data.post, ...posts]);
      // Clear the content after successful submission
      setContent('');
    } catch (error) {
      console.error('Error posting content:', error);
    }
  };

  useEffect(() => {
    if (props.classData) {
      // Fetch the posts from the server
      const fetchPosts = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_PATH_URL}/class/${props.classData._id}/feed`,
            { withCredentials: true }
          );
          setPosts(response.data.posts);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      };

      fetchPosts();
    }
  }, [props.classData]);

  const handleDeletePost = async (postId) => {
    try {
      // Send a request to delete the post
      await axios.delete(`${process.env.REACT_APP_PATH_URL}/posts/${props.classData._id}/feed/${postId}`, {
        withCredentials: true,
      });
  
      // Update the posts state by removing the deleted post
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  //these two are for updating class toggle
  const handlePopupToggle = () => {
    setShowPopup(!showPopup);
  };
  const handleUpdateClassDetails = (updatedDetails) => {
    props.updateClassDetails(updatedDetails);
  };


  if (props.classData === null) {
    return <div className="class-page-data"></div>;
  }
  

  return (
    <div className="class-page-data">
      <div className="class-details-owned">
        <h1>{props.classData.classTitle}</h1>
        <p><b>Class Description: </b>{props.classData.classDesc}</p>
        <p><b>Class Code: </b>{props.classData.classCode}</p>
        <div className='class-detail-update'>
        <button  onClick={handlePopupToggle}>Edit Info</button>
        </div>
        {showPopup && <PopupComponent updateClassDetails={handleUpdateClassDetails} classData={props.classData}onClose={handlePopupToggle}/>}
      </div>
      <div className="feedandassignment">
        <div className="feed feed-for-owner">
          <h2>Feed</h2>
          <form onSubmit={handleSubmit}>
            <textarea
               value={content}
               onChange={handleContentChange}
               onClick={(e) => e.target.style.height = 'auto'}
               onFocus={(e) => e.target.style.height = 'auto'}
               onBlur={(e) => e.target.style.height = 'inherit'}
               placeholder="Enter your post content"
              ></textarea>
              <div className='post-detail'>
            <button type="submit">Post</button></div>
          </form>
          <ul>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} user={props.userdata} onDeletePost={handleDeletePost} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StreamComponent;
