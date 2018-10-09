function LoginScreen(props) { //eslint-disable-line no-unused-vars
  return (
    <section className="loginScreen" {...props.attributes}>
      <h1>Welcome to awesome ratings community!</h1>
      <div className="loginBox">
        <div>Username:<input /></div>
        <div>Password:<input /></div>
        <div><button className="loginButton">Login</button></div>
      </div>
    </section>
  );
}

