import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px" }) => {

  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={image}
      />
    
    </Box>
  );
};
//https://social-media-application-np5g.onrender.com/assets/sub-buzz-1265-1692123410-1.png

export default UserImage;