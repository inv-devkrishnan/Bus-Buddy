import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { useAuthStatus } from "../utils/hooks/useAuth";
import { deleteUserAccount } from "../utils/apiCalls";
import { useLogout } from "../utils/hooks/useLogout";

function DeleteAccount() {
  const navigate = useNavigate();
  const logout = useLogout();
  const authStatus = useAuthStatus();
  useEffect(() => {
    console.log(authStatus.current);
    if (!authStatus.current) {
      navigate("/login");
    }
  }, [authStatus, navigate]);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const deleteAccount = async () => {
    if (authStatus.current) {
      const response = await deleteUserAccount();
      if (response.status) {
        logout();
      }
    } else {
      navigate("/login");
    }
  };
  return (
    <Container className="mt-3">
      <h1>Delete Account</h1>
      <div className="ms-3 mt-3">
        <p>
          After deleting your account you have no longer access to the contents
          of this account. <br></br>{" "}
          <span className="fw-bolder">
            Are you sure you want delete this account ?
          </span>
        </p>
        <Button variant="danger" onClick={handleShow}>
          Delete account
        </Button>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Conformation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={deleteAccount}>
            Delete account
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
export default DeleteAccount;
