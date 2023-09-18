import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          Sociopedia
        </Typography>
      </Box>
   

      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
      
            <div style={{ display: "flex",  justifyContent : "center", textAlign : "center" }} >
 Welcome to Socipedia, the Social Media for Sociopaths !
            </div>
            <div style={{ display: "flex",  justifyContent : "center", textAlign : "center", paddingTop: "10px" }} >The creater <span style={{paddingLeft: "6px"}} >--></span>  <span style={{paddingLeft: "6px"}}><Link to="https://www.linkedin.com/in/rishikesh-ghosh-9a226a230/">   Rishikesh Ghosh</Link></span></div>
            
            
         
        </Typography>
        <Form />
      </Box>
      
    </Box>
  );
};

export default LoginPage;