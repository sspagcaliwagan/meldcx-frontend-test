import React, { Component } from "react";
import "./App.css";

import Login from "components/Login";
import NotFound from "components/NotFound";
import Devices from "components/Devices";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthService } from "services/AuthenticationService";
import ProtectedRoute from "ProtectedRoute";
import { history } from "helpers/history";
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
    };
  }

  componentDidMount() {
    AuthService.currentUser.subscribe((user) =>
      this.setState({ currentUser: user })
    );
  }

  render() {
    const { currentUser } = this.state;
    return (
      <div className="App">
        <BrowserRouter history={history}>
          <Routes>
            <>
              <Route
                exact
                path="/"
                element={<Login currentUser={currentUser} />}
              />
              <Route exact path="/devices" element={<ProtectedRoute />}></Route>
              <Route
                path="login"
                element={<Login currentUser={currentUser} />}
              />
              <Route path="*" element={<NotFound />} />
            </>
          </Routes>
        </BrowserRouter>
        {/* 
        <Router history={history}>
          <Routes>
            <ProtectedRoute exact path="/" component={Login} />
            <Route path="/login" component={Login} />
            <Route path="/devices" component={Devices} />
          </Routes>
        </Router> */}
      </div>
    );
  }
}

export default App;
