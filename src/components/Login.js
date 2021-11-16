import React, { Component } from "react";
import { AuthService } from "services/AuthenticationService";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { history } from "helpers/history";
import * as Yup from "yup";

class Login extends Component {
  componentDidMount() {
    let auth = AuthService.currentUserValue;
    //redirect to devices if user has already logged in
    if (auth) {
      history.push("/devices");
      window.location.reload();
    }
  }

  render() {
    return (
      !this.props.currentUser && (
        <div className="container">
          <div className="row">
            <div className="col-md-4 offset-md-4">
              <div className="login-form bg-light mt-4 p-4">
                <Formik
                  initialValues={{ email: "", password: "" }}
                  validationSchema={Yup.object({
                    email: Yup.string()
                      .email("Invalid email address")
                      .required("Email is required"),
                    password: Yup.string().required("Password is required"),
                  })}
                  onSubmit={(values) => {
                    AuthService.login(values).catch((error) => {
                      if (error.response) {
                        document.getElementById("login-error").innerHTML =
                          "Invalid login credentials";
                      }
                    });
                  }}
                >
                  <Form className="row g-3">
                    <h2>Login</h2>
                    <div className="col-12">
                      <Field
                        name="email"
                        type="email"
                        className="form-control"
                        placeholder="Email Address"
                      />
                      <ErrorMessage
                        name="email"
                        className="error-message"
                        component="div"
                      />
                    </div>
                    <div className="col-12">
                      <Field
                        name="password"
                        type="password"
                        className="form-control"
                        placeholder="Password"
                      />
                      <ErrorMessage
                        name="password"
                        className="error-message"
                        component="div"
                      />
                    </div>
                    <div className="error-message">
                      <span id="login-error"></span>
                    </div>
                    <div className="button-group">
                      <button
                        id="loginBtn"
                        className="login-button btn btn-lg btn-primary btn-block"
                        type="submit"
                      >
                        Log In
                      </button>
                    </div>
                  </Form>
                </Formik>
              </div>
            </div>
          </div>
        </div>
      )
    );
  }
}

export default Login;
