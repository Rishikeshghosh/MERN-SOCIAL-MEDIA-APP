import { Avatar, Divider, Grid, Paper } from '@mui/material'
import React from 'react'

const CommentWidgets = ({userName,  userComment,  userImage, date, time}) => {
    console.log({userName,  userComment,  userImage, date, time})
  let postedDate = date.split(" ")[1]
  let postedTime = time.split(" ")[1]

  
  return (
    
    <div style={{ padding: 14 }} className="App">
      
      <Paper style={{ padding: "10px 15px" }}>
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Avatar alt="Remy Sharp" src={userImage}  />
          </Grid>
          <Grid justifyContent="left" item xs zeroMinWidth>
            <h4 style={{ margin: 0, textAlign: "left", marginBottom: "-11px" }}>@{userName}</h4>
            <p style={{ textAlign: "left", marginBottom: "-10px", paddingTop: "-15px" }}>
            {userComment}
            </p>
            <p style={{ textAlign: "left", color: "gray" }}>
              Posted { postedDate + " " +  " At " +  postedTime}  
            </p>
          </Grid>
        </Grid>
        <Divider variant="fullWidth" style={{ margin: "2px 0" }} />
       
      </Paper>

     
     
      
    </div>
  
  )
}

export default CommentWidgets