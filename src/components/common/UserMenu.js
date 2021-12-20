import React from "react";
import { Dropdown, DropdownButton, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import { logout } from "../../store/user/userActions";
import { FiUser } from "react-icons/fi";
import alertify from "alertifyjs";
import { isAdmin } from "../../utils/auth";

const UserMenu = () => {
  const { userState, dispatchUser } = useStore();
  const { user, isUserLogin } = userState;
  const navigate = useNavigate();

  const handleLogout = () => {
    alertify.confirm(
      "Logout",
      "Are you sure you want to log out?",
      () => {
        dispatchUser(logout());
        localStorage.removeItem("token");
        navigate("/");
      },
      () => {
        console.log("cancelled");
      }
    );
  };
  return (
    <>
      {isUserLogin ? (
        <DropdownButton
          id="dropdown-basic-button"
          title={`${user.firstName} ${user.lastName}`}
          size="sm"
          align="end"
        >
          {isAdmin(user.roles) && (
            <>
              <Dropdown.Item as={Link} to="/admin/users">
                User Management
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/admin/vehicles">
                Vehicle Management
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/admin/reservations">
                Reservation Management
              </Dropdown.Item>
              <Dropdown.Divider />
            </>
          )}
          <Dropdown.Item as={Link} to="/reservations">
            Reservations
          </Dropdown.Item>
          <Dropdown.Item as={Link} to="/profile">
            Profile
          </Dropdown.Item>
          <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
        </DropdownButton>
      ) : (
        <Button as={Link} to="/login" size="sm">
          <FiUser /> Login
        </Button>
      )}
    </>
  );
};

export default UserMenu;
