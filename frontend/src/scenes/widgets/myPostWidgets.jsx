import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
  CircularProgress,
  Alert,
} from "@mui/material";
import FlexBetween from "../../components/flexBetween";
import Dropzone from "react-dropzone";
import UserImage from "../../components/userImage";
import WidgetWrapper from "../../components/WidgetsWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state/index";
import AdvertWidget from "./advertWidget";
import { setStatus } from "../../state/index";


const MyPostWidget = ({ picturePath }) => {
  //const pogress = useSelector((state) =>state.statusProgress)
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [formValue, setFormValue] = useState({})
  const [uploadImage ,  setUploadImage] = useState("")
  const [image, setImage] = useState(null);
  const [post, setPost] = useState("");
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [uploaded, setUploaded] =useState(false)
  const [pogress, setPogress] = useState(false)
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;
const resetUpload =  ()=> {
  setTimeout(()=> {
    setUploaded(false)
  },4000)
}
const modifyPicture = async (userPicture)=> {
    try{
      console.log(userPicture)
      const formdata = new FormData()
      formdata.append("file",userPicture )
      formdata.append("upload_preset","social-media-app" )
        formdata.append("cloud_name", "");
      const response = await fetch("https://api.cloudinary.com/v1_1/dwfqd9v0w/image/upload", {
        method: "POST",
        body: formdata
      })
      const data = await response.json()
    return data.secure_url.toString()
    }catch(error){
      console.log(error)
    }

  }
  const handlePost = async () => {
   
    setPogress(true)
    dispatch(setStatus())
 
    
    formValue["userId"] = _id
    formValue["description"]= post;
    
    if (uploadImage !== "") {
    
      let userImage = await modifyPicture(uploadImage)
    console.log(userImage)
   
  formValue["picturePath"] = userImage
      
    }
    

    const response = await fetch(`https://social-media-app-icnj.onrender.com/auth/mainposts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` , "Content-Type": "application/json" },
      body: JSON.stringify(formValue),
    });
   
    const posts = await response.json();
    dispatch(setPosts({ posts }));
    setIsImage(false)
     setUploadImage("")
     setFormValue({})
    setUploaded(true)
     setPogress(false)
    dispatch(setStatus())
   resetUpload()
   
   
    setImage(null);
    setPost("");
  };

  return (
    <>
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath} />
        <InputBase
          placeholder="What's on your mind..."
          onChange={(e) => setPost(e.target.value)}
          value={post}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>
      {isImage && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
         <div><input onChange={(e)=> setUploadImage(e.target.files[0])} type="file"/></div>
        </Box>
      )}

      <Divider sx={{ margin: "1.25rem 0" }} />
{ pogress ?<div style={{display: "flex", justifyContent: "center", alignItems: "center", paddingBottom: "13px"}}><CircularProgress /></div> :null}
 { uploaded ? <div style={{paddingBottom: "13px"}}><Alert severity="info">Your post succesfully uploaded ! </Alert></div> : null}
      <FlexBetween>
        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Image
          </Typography>
        </FlexBetween>

        {isNonMobileScreens ? (
          <>
          <FlexBetween gap="0.25rem">
              <GifBoxOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Clip</Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem">
              <AttachFileOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Attachment</Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem">
              <MicOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Audio</Typography>
            </FlexBetween>
          </>
        ) : (
          <>
          
           <FlexBetween gap="0.25rem">
              <GifBoxOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Clip</Typography>
            </FlexBetween>
                        

            <FlexBetween gap="0.25rem">
              <MicOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Audio</Typography>
            </FlexBetween>

            </>
          
        )}

        <Button
          //disabled={!post}
          onClick={handlePost}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          POST
        </Button>
      </FlexBetween>
    </WidgetWrapper>
    <div style={{marginTop: "2rem"}}><AdvertWidget/></div>
    
    </>
  );
};

export default MyPostWidget;
