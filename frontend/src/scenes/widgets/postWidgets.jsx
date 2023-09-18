import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Alert, Box, CircularProgress, Divider, IconButton, TextField, TextareaAutosize, Typography, useTheme } from "@mui/material";
import FlexBetween from "../../components/flexBetween";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetsWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost, setReRenderPage } from "../../state/index";
import "./commentText.css"
import CommentWidgets from "./commentWidgets";
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [showAlert , setShowAlert] = useState("")
  const [isComments, setIsComments] = useState(false);
  const [likePost, setLikePost] = useState(false)
  const [comment, setComment] = useState("")
  const [deleteLoader, setDeleteLoader] = useState(false)
  const [showLoader ,setShowLoader] = useState(false)
  const [commentLoader ,setCommentLoader] = useState(false)
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const randerPageAgain = useSelector((state) => state.reRenderPage)
  const isLiked =  likes ? Boolean(likes[loggedInUserId]) : false;
  const likeCount = likes ?  Object.keys(likes).length : false;
  
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
const handleComment = async(e)=> {
setCommentLoader(true)
 setComment(e.target.value)
  const response = await fetch(`https://social-media-app-icnj.onrender.com/auth/posts/comment/update`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId : postId , comment:comment}),
    });
    dispatch(setReRenderPage())
   setCommentLoader(false)
   setComment("")

}
  const patchLike = async () => {
   setShowLoader(true)
 
    const response = await fetch(`https://social-media-app-icnj.onrender.com/auth/posts/${postId}/likes`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const {updatedPost,status} = await response.json();
    dispatch(setPost({ post: updatedPost }));
    setShowLoader(false)
    setShowAlert(postId)
    
    if (status === "liked")  setLikePost(true)
    else  setLikePost(false)
    setTimeout(()=> {
    setShowAlert("")
    }, 4000)
   
  };
  const handleDeletePost =async () => {
     setDeleteLoader(true)
const response = await fetch(`https://social-media-app-icnj.onrender.com/auth/posts/delete/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
     
    });
    dispatch(setReRenderPage())
     setDeleteLoader(false)

  }

  return (
    <>
    
    <WidgetWrapper m="2rem 0">
     
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%" 


          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={picturePath}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            {!isComments ?  <IconButton onClick={patchLike} >
              { isLiked && isLiked ? (
                <>
                   { showLoader ? <div style={{display: "flex", justifyContent: "center", alignItems: "center",  }}  ><CircularProgress  size="17px" /></div> : <FavoriteOutlined sx={{ color: primary }} /> }
                </>
                
              ) : (
                <> { showLoader ? <div style={{display: "flex", justifyContent: "center", alignItems: "center",  }}  ><CircularProgress  size="17px" /></div> : <FavoriteBorderOutlined />  }</>
                
              )}
            </IconButton>: null}
          { !isComments? <Typography>{likeCount}</Typography> :null}
           
          </FlexBetween>
         

          <FlexBetween gap="0.3rem">
            <div style={isComments ? {marginLeft: "-1.1rem"} :{marginLeft: "0px" }}> <IconButton  onClick={() => setIsComments(!isComments)}>
           
              <ChatBubbleOutlineOutlined />
            </IconButton></div>
            
           
            {isComments ?  <><input   className="comment" 
             type="text"
        id="message"
        name="message"
   placeholder="Say something.." onChange={ (e)=> setComment(e.target.value)}  value={comment}></input>  <span onClick={handleComment}><SendTwoToneIcon/></span> </> : null}
            {!isComments ? <Typography>{comments && comments.length }</Typography> : null}
         
           
          </FlexBetween>
            { loggedInUserId == postUserId && !isComments ?<div onClick={handleDeletePost} style={{paddingLeft: "3px", paddingTop: "5px",}}>
            { deleteLoader ? <div style={{paddingTop:"2px"}}><CircularProgress size="17px"/></div> : <div style={{paddingTop: "1px"}}><DeleteOutlinedIcon /></div>}
            </div> : null}
        </FlexBetween>

        <IconButton>
      
      {!isComments ? <ShareOutlined/> : null}
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          { commentLoader ? <div style={{display: "flex", justifyContent: "center", alignItems: "center", paddingBottom: "18px", paddingTop: "11px"}}><CircularProgress size="2rem"/> </div> : comments.length <1 ?<div style={{display: "flow", justifyContent: "center", alignItems: "center", textAlign: "center", fontFamily: "Sans-serif", fontSize: "1rem", paddingBottom: "11px"}}>First to comment on this post !</div>:null}
          {comments.map((value, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <CommentWidgets userName={ value.user.firstName + " " + value.user.lastName} userComment={value.comment} userImage={value.user.
picturePath 
} date={value.date} time={value.time}/>
            </Box>
          ))}
          <Divider />
        </Box>
      )}
    </WidgetWrapper>
       {showAlert ==postId? <div >  <Alert severity="info">{ likePost ? "You liked " + name + " post ! 😃" :  "You disliked " + name + " post ! 😔"}</Alert></div> :null}

    
    </>
  );
};

export default PostWidget;