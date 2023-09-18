import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state/index";
import PostWidget from "./postWidgets";

const PostsWidget = ({ userId, userProfile }) => {
 
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const isProfile = useSelector((state) => state.isUserProfile);
  const randerPageAgain = useSelector((state) => state.reRenderPage)

  const getPosts = async () => {
 
    const response = await fetch("https://social-media-app-icnj.onrender.com/auth/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
   
    dispatch(setPosts({ posts: data }));
  };

  const getUserPosts = async () => {
    
    const response = await fetch(
      `https://social-media-app-icnj.onrender.com/auth/posts/${userId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    if (isProfile) {
    
      getUserPosts();
    } else {
      getPosts();
    }
  }, [randerPageAgain]); 
  return (
    <>
      { posts.length && posts.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;