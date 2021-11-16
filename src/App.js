import "./App.css";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";
import { useState } from "react";

function App() {
  const [loginData, setLoginData] = useState(
    localStorage.getItem("loginData")
      ? JSON.parse(localStorage.getItem("loginData"))
      : null
  );
  const [FBData, setFBData] = useState(
    localStorage.getItem("FBData")
      ? JSON.parse(localStorage.getItem("FBData"))
      : null
  );
  const componentClicked = () => {
    console.log("logged in");
  };
  const responseFacebook = (response) => {
    console.log(response);
    setFBData(response);
    localStorage.setItem("FBData", JSON.stringify(response));
  };

  const handleFailure = (result) => {
    console.log(result);
  };

  const handleLogin = async (googleData) => {
    const res = await fetch("/api/google-login", {
      method: "POST",
      body: JSON.stringify({
        token: googleData.tokenId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    setLoginData(data);
    console.log(data);
    localStorage.setItem("loginData", JSON.stringify(data));
  };
  const handleLogout = () => {
    localStorage.removeItem("loginData");
    localStorage.removeItem("FBData");

    setFBData(null);
    setLoginData(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Google / Facebook Login App</h1>
        <div>
          {loginData ? (
            <div>
              <img
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                }}
                src={loginData.picture}
              />

              <h3>welcome, {loginData.name}</h3>
              <h3>You are logged in as {loginData.email}</h3>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              buttonText="Log in with Google"
              onSuccess={handleLogin}
              onFailure={handleFailure}
              cookiePolicy={"single_host_origin"}
            ></GoogleLogin>
          )}
        </div>
        <section>
          {FBData ? (
            <div>
              <img
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                }}
                src={FBData.picture.data.url}
              />

              <h3>welcome, {FBData.name}</h3>
              <h3>You are logged in as {FBData.email}</h3>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <FacebookLogin
              appId={process.env.FB_ID}
              autoLoad={true}
              fields="name,email,picture"
              onClick={componentClicked}
              callback={responseFacebook}
              icon="fa-facebook"
            />
          )}
        </section>
      </header>
    </div>
  );
}

export default App;
