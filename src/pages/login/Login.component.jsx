import { useState } from "react";
import { useHistory } from "react-router-dom";
import { auth } from "../../firebase/firebase-config";
import Box from "@mui/material/Box";
import { signInWithEmailAndPassword } from "firebase/auth";
import PasswordInput from "../../components/mui/PasswordInput.components";
import TextFieldInput from "../../components/mui/TextFieldInput.component";
import { useSelector } from "react-redux";
import BasicButton from "../../components/mui/BasicButton.component";
import { useDispatch } from "react-redux";
import { isAuthAction, loggedInUserAction } from "../../store/actions/actions";
import Spinner from "../../components/spinner/Spinner.component";
import "./login.styles.scss";

export default function Login() {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const statesObject = useSelector((state) => {
    return {
      email: state.email,
      password: state.password
    };
  });

  const login = async () => {
    try {
      setIsLoading(true);
      isValidInput();
      const { user } = await signInWithEmailAndPassword(
        auth,
        statesObject.email,
        statesObject.password
      );
      dispatch(isAuthAction(true));
      dispatch(loggedInUserAction({ uid: user.uid, email: user.email }));
      history.push("/home");
    } catch (err) {
      setComment(err.message);
      setIsLoading(false);
    }
  };

  const isValidInput = () => {
    if (statesObject.email === "") {
      throw new Error("Missing email");
    } else if (statesObject.password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
  };

  return (
    <div className="Login">
      <div className="login-view">
        <p className="login-title">Login</p>
        <p className="login-comment">{comment}</p>
        <div className="login-box">
          <div className="login-box-inputs">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                height: 200,
              }}
            >
              <div className="email">
                <TextFieldInput label="email" />
              </div>
              <div className="password">
                <PasswordInput label="password" />
              </div>
            </Box>
          </div>
          <BasicButton label="login" variant="contained" cb={login} />
        </div>
      </div>
      {isLoading && <Spinner />}
    </div>
  );
}
