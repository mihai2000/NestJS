import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import './App.css';

function App() {
  return (
    <GoogleOAuthProvider clientId="222519828765-48r1uh0uva1a7tene6ttfjtqgsclobvs.apps.googleusercontent.com">
      <GoogleLogin
        buttonText="Login"
        onSuccess={(response) => {
          console.log(response);
          fetch("http://localhost:3000/auth/google-authentication", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: response.credential,
            }),
          })
            .then((response) => console.log(response))
            .then((data) => console.log(data));
        }}
      />
    </GoogleOAuthProvider>
  );
}

export default App