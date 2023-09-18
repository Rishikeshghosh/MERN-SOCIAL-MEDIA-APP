import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector , useDispatch} from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../../scenes/navbar";
import FriendListWidget from "../../scenes/widgets/frindListWidgets";
import MyPostWidget from "../../scenes/widgets/myPostWidgets";
import AddIcon from '@mui/icons-material/Add';
import UserWidget from "../../scenes/widgets/userWidgets";
import state, { setIsUserProfile } from "../../state";
import PostsWidget from "../widgets/postsWidgets";

const ProfilePage = () => {
  const dispatch = useDispatch()
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const loggedInUser = useSelector((state)=> state.user._id)
  const token = useSelector((state) => state.token);
  const reRander = useSelector((state) => state.reRenderPage)
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const getUser = async () => {
     dispatch(setIsUserProfile({isUserProfile :true }))
    const response = await fetch(`https://social-media-app-icnj.onrender.com/auth/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
   
   
  };

  useEffect(() => {
    getUser();
  }, [reRander]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={userId} picturePath={user.picturePath} />
          <Box m="2rem 0" />
          <FriendListWidget userId={userId} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >{
          loggedInUser ===  user._id ? <MyPostWidget picturePath={user.picturePath} /> : null
        }
          
          <Box m="2rem 0" />
          <PostsWidget userId={userId}   />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;