import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
  DeleteOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme, TextField, Button, CircularProgress } from "@mui/material";
import UserImage from "../../components/userImage";
import FlexBetween from "../../components/flexBetween";
import WidgetWrapper from "../../components/WidgetsWrapper";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import  LinkedIn from "../../Assests/linkedin.png";
import twitter from "../../Assests/twitter.png";
import AddIcon from '@mui/icons-material/Add';
import Dropzone from "react-dropzone";
import {
 
  IconButton,
  
} from "@mui/material";
import { setLogin, setReRenderPage } from "../../state";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const [showAddProfile , setShowAddProfile] = useState(false)
  const [newOccupation, setNewOccupation ] = useState("")
  const [newAddress, setNewAddress ] = useState("")
  const [picture, setPicture] = useState("")
  const [showAddress, setShowAddress] = useState(false)
  const [userNewPic, setUserNewPic] = useState("")
  const [showOccupation, setShowOccupation] = useState(false)
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const loggedInUser =useSelector((state)=> state.user)
  const [formValue, setFormValue] = useState({})
  const reRander = useSelector((state) => state.reRenderPage)
  const [progress, setProgress] = useState(false)
  const dispatch =useDispatch()

  const modifyPicture = async (userPicture)=> {
    try{
    
      const formdata = new FormData()
      formdata.append("file",userPicture )
      formdata.append("upload_preset","social-media-app" )
        formdata.append("cloud_name", "");
      const response = await fetch("https://api.cloudinary.com/v1_1/dwfqd9v0w/image/upload", {
        method: "POST",
        body: formdata
      })
      const data = await response.json()
    return data.secure_url
    }catch(error){
      console.log(error)
    }

  }
  
  const handleChangeProfilePic = async()=> {
   
    setProgress(true)
    let updatedOccupation = "";
    let updatedAddress = "" ;
   
    if (!newAddress){
     updatedAddress = user.location
    }else {
      updatedAddress = newAddress
    }
    if (!newOccupation){
       updatedOccupation =user.occupation
    }else {
     updatedOccupation = newOccupation
    }
   
    formValue["occupation"] = updatedOccupation 
    formValue["location"] = updatedAddress 
    if (userNewPic){
       let newPic = await modifyPicture(userNewPic)
       formValue["picturePath"] = newPic
    }
      
      const response = await fetch(`https://social-media-app-icnj.onrender.com/auth/change/profic/pic`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` ,"Content-Type": "application/json"},
      body: JSON.stringify(formValue)
    });
    let data = await response.json()
   
    dispatch(setReRenderPage())
 setProgress(false)
      const updatedUser = await fetch(`https://social-media-app-icnj.onrender.com/auth/users/${loggedInUser._id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
     
    });
    let data1 =  await updatedUser.json()
    dispatch(setLogin({user : data1, token: token }))
  
   

  }

  const getUser = async () => {
    const response = await fetch(`https://social-media-app-icnj.onrender.com/auth/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  
    const data = await response.json();
    setUser(data);
  };
  

  useEffect(() => {
    getUser();
  }, [reRander]); 

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
  } = user;

  return (
  <>
  
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <FlexBetween gap="1rem">
          <div style={{position  : "relative"}}>
  { !showAddProfile   ?  <UserImage image={picturePath} /> : null}
          </div>
         
          
         { !showAddProfile && !progress ? <div  style={{position : "absolute", left:'5.7rem', fontWeight: "5rem", color: "#00D5FA", paddingTop: "6px" }}>
  { user._id === loggedInUser._id && !progress ? <AddIcon onClick={()=> setShowAddProfile(true)} fontSize="large"/> :null}
          </div> : null}
               {
              showAddProfile && !progress   ?<div style={{marginLeft: "-18px"}} >  <Box
                
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  padding="10px"
                 
               
                >
                 { !progress ? <input onChange={(e)=> setUserNewPic(e.target.files[0])} type="file"/>:null}
                     
                

                </Box> 
                { picture ? <div style={{display:"flex", justifyContent : "end"}}>{picture && (
                  <IconButton
                    onClick={() => setPicture("")}
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutlined fontSize="medium" />
                  </IconButton>
                )}</div> : null}
                
                </div>
                : null}
                {progress ? <div style={{display: "flex", justifyContent: "center", alignItems: "center", alignContent: "center"}}><CircularProgress/></div>:null }
        
          
        { !showAddProfile ?  <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {firstName} {lastName}
            </Typography>
            <Typography color={medium}>{friends.length} { friends.length >1 ? "Followers" : "Follower"}</Typography>
          </Box> : null}

        </FlexBetween>
         { !showAddProfile ? <ManageAccountsOutlined /> : null}
      </FlexBetween>
       {  showAddProfile && !progress ? <div>
           <span>Location :</span>     <input onClick={()=>setShowAddress(true)} onChange={(e)=>  setNewAddress(e.target.value)} style={{backgroundColor: "black", color: 'white', padding : "6px"}} value={ newAddress || showAddress? newAddress : user.location}></input>
           <span>Occupation :</span> <input onClick={()=>setShowOccupation(true)} onChange={(e)=>  setNewOccupation(e.target.value)}  style={{backgroundColor: "black", color: 'white',  padding : "6px"}} value={ newOccupation || showOccupation ? newOccupation : user.occupation}></input> 
        </div> : null}
 { showAddProfile?
               <div style={{display: 'grid', padding : "1rem", gap: "1rem"}}>
                { showAddProfile ?  <Button onClick={()=> setShowAddProfile(false)} variant="contained">Close</Button> : null}
 { showAddProfile ?  <Button onClick={handleChangeProfilePic} variant="contained">Post</Button>  :null}
               </div> : null}
      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{occupation}</Typography>
        </Box>
      </Box>

      <Divider />

      {/* THIRD ROW */}
      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Who's viewed your profile</Typography>
          <Typography color={main} fontWeight="500">
            {viewedProfile}
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={medium}>Impressions of your post</Typography>
          <Typography color={main} fontWeight="500">
            {impressions}
          </Typography>
        </FlexBetween>
      </Box>

      <Divider />

      {/* FOURTH ROW */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          Social Profiles
        </Typography>

        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <img src={twitter} alt="twitter" />
            <Box>
              <Typography color={main} fontWeight="500">
                Twitter
              </Typography>
              <Typography color={medium}>Social Network</Typography>
            </Box>
          </FlexBetween>
         {loggedInUser._id === user._id ? <EditOutlined sx={{ color: main }} /> : null } 
        </FlexBetween>

        <FlexBetween gap="1rem">
          <FlexBetween gap="1rem">
            <img src={LinkedIn} alt="linkedin" />
            <Box>
              <Typography color={main} fontWeight="500">
                Linkedin
              </Typography>
              <Typography color={medium}>Network Platform</Typography>
            </Box>
          </FlexBetween>
         {loggedInUser._id === user._id ? <EditOutlined sx={{ color: main }} /> : null } 
        </FlexBetween>
      </Box>
    </WidgetWrapper>
    
    </>
  );
};

export default UserWidget;