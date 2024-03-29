import React from "react";
import { Alert } from "react-bootstrap";

const NotAuthorizedPage = () => {
  return (
    <Alert variant="danger">You are not authorized to see this page.</Alert>
  );
};

export default NotAuthorizedPage;
