import React,{ useState } from 'react';
import { Login } from "./Login";
import { Register  } from './Register';
import Grid from '@mui/material/Grid'; 

function Landing() {
  const [currentForm, setCurrentForm] = useState('login');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }

  return (
    <Grid container spacing = {0} height = "100%">
      <Grid item xs display="flex" >
        <img src = 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/cute-cat-photos-1593441022.jpg' alt = "landing cute picture" width= "100%"/>
      </Grid>
      <Grid item xs display="flex" justifyContent="center" alignItems="center">
      {
        currentForm === 'login' ? <Login onFormSwitch={toggleForm} /> : <Register onFormSwitch={toggleForm}/>
      }
      </Grid>
    </Grid>
  );
}

export default Landing;