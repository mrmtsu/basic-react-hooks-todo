import { Button, FormControl, TextField, Typography } from "@material-ui/core";
import { ChangeEvent, useEffect, useState, VFC } from "react"
import { auth } from "./firebase";
import styles from "./Login.module.css";

export const Login: VFC = (props: any) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const onChangePass = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((user) => {
      user && props.history.push("/");
    });
    return () => unSub();
  }, [props.history]);

  return (
    <div className={styles.login__root}>
      <h1>{isLogin ? "Login" : "Register"}</h1>
      <br />
      <FormControl>
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          name="email"
          label="E-mail"
          value={email}
          onChange={onChangeEmail}
        />
      </FormControl>
      <br />
      <FormControl>
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          name="password"
          label="password"
          type="password"
          value={password}
          onChange={onChangePass}
        />
      </FormControl>
      <br />
      <Button variant="contained" color="primary" size="small" onClick={
        isLogin ? async () => {
          try {
            await auth.signInWithEmailAndPassword(email, password);
            props.history.push("/")
          } catch (error) {
            alert(error.message)
          }
        } : async () => {
          try {
            await auth.createUserWithEmailAndPassword(email, password);
            props.history.push("/")
          } catch (error) {
            alert(error.message);
          }
        }
      }>
        {isLogin ? "login" : "register"}
      </Button>
      <br />
      <Typography align="center">
        <span onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Create new account ?" : "Back to login"}
        </span>
      </Typography>
    </div>
  )
}
