import { useRouteError } from "react-router-dom";
import React from "react";
import { Container } from "@mui/system";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <Container maxWidth="md" className='center-align'>
        <h1>ono we have a problem!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
        <img src="https://149359538.v2.pressablecdn.com/wp-content/uploads/2018/06/Kitten.jpg" className="w-100" style={{borderRadius: "20px"}}/>
      </Container>
    </div>
  );
}