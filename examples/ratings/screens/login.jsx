function LoginScreen(props) { //eslint-disable-line no-unused-vars
  return (
    <section className="loginScreen" {...props.attributes}>
      <h1>Welcome to awesome ratings community!</h1>
      <div className="loginBox">
        <div>Username:<input className="loginInput usernameInput" /></div>
        <div>Password:<input className="loginInput passwordInput" /></div>
        <div><button className="loginButton">Login</button></div>
      </div>
    </section>
  );
}

