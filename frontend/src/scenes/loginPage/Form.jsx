import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  Alert,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state/index";



const registerSchema = yup.object().shape({
  firstName: yup.string().required(" First tname is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Please enter a valid email").required("Please enter a valid email"),
  password: yup.string().required(" Password is required"),
  location: yup.string().required("Location is required"),
  occupation: yup.string().required("Occupation is required"),
 
});

const loginSchema = yup.object().shape({
  email: yup.string().email("Please enter a valid email").required("Please enter a valid email"),
  password: yup.string().required("Password is required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const [error, setError] = useState("")
  const [pic, setPic] = useState("")
  const [allDocs, setAllDocs] = useState({})
  
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
    return data.secure_url
    }catch(error){
      console.log(error)
    }

  }
  const register = async (values, onSubmitProps) => {
    try{
    let formData =new FormData()
     for (let value in values) {
     
    
     allDocs[value] = values[value]
    }

     const picture = await modifyPicture(pic)
    console.log(picture)
    allDocs["picturePath"] = picture
    
    const savedUserResponse = await fetch(
      "https://social-media-app-icnj.onrender.com/auth/register",
      {
         
        method: "POST",
         headers: { "Content-Type": "application/json" },
        body: JSON.stringify(allDocs),
      }
    );
   
    const savedUser = await savedUserResponse.json();
    console.log(savedUser)
    
    onSubmitProps.resetForm();

    if (savedUser) {
      setPageType("login");
    }
  }catch(err){
    console.log(err)
  }
  };
  const removeErr = ()=> {
     setTimeout(()=> {
    setError("")
    },3000)
  }

  const login = async (values, onSubmitProps) => {
    try{
   
    const loggedInResponse = await fetch("https://social-media-app-icnj.onrender.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    let loggedIn = await loggedInResponse.json();
    console.log(loggedIn)
    if (loggedIn.message){
      setError(loggedIn.message)
      loggedIn = null
        
  removeErr()
    
    }
    
    
    onSubmitProps.resetForm();
    localStorage.setItem("user", JSON.stringify(loggedIn.user))
    localStorage.setItem("token", JSON.stringify(loggedIn.token))
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/home");
    }
  
  }catch(error){
    console.log(error)
  }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
       
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Location"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.location}
                  name="location"
                  error={Boolean(touched.location) && Boolean(errors.location)}
                  helperText={touched.location && errors.location}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Occupation"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.occupation}
                  name="occupation"
                  error={
                    Boolean(touched.occupation) && Boolean(errors.occupation)
                  }
                  helperText={touched.occupation && errors.occupation}
                  sx={{ gridColumn: "span 4" }}
                />
                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                   <div>
                <input onChange={(e) => setPic(e.target.files[0])} type="file"/>
             
                </div>
               
                </Box>
              </>
            )}
            

            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {isLogin ? "LOGIN" : "REGISTER"}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
            {error ? <div style={{paddingBottom: "19px",}}><Alert severity="error" >{error}</Alert></div> : null}
              { isLogin
                ?  <div style={ {display : "flex" , justifyItems : "center", textAlign : "center", justifyContent: "center"}}>Don't have an account? Sign Up here.</div>
                : <div style={ {display : "flex" , justifyItems : "center", textAlign : "center",justifyContent: "center"}}>Already have an account? Login here.</div>}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default  Form