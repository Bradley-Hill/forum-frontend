import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "./AuthForms.scss";

const AuthContainer: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-forms">
      <div className="auth-forms-header">
        <h2>{isLogin ? "Login" : "Register"}</h2>
        <p>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            className="auth-forms-toggle"
            onClick={() => {
              setIsLogin(!isLogin);
            }}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>

      {isLogin ? <LoginForm /> : <RegisterForm />}
    </div>
  );
};

export default AuthContainer;
