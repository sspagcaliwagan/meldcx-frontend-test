import React from "react";
import { Navigate } from "react-router-dom";
import { AuthService } from "services/AuthenticationService";
import Devices from "components/Devices";
export const ProtectedRoute = () => {
  let auth = AuthService.currentUserValue;
  // If authorized, return devices component
  // If not, navigate to login
  return auth ? <Devices /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
