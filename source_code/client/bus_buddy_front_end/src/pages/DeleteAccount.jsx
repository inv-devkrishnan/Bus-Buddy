import {useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import Swal from "sweetalert2";
import { deleteUserAccount } from "../utils/apiCalls";
import { useLogout } from "../utils/hooks/useLogout";

function DeleteAccount() {
  const logout = useLogout();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const deleteAccount = async () => {
    // function which calls the api to delete account
    const response = await deleteUserAccount();
    console.log(response)
    if (response.status) {
      handleClose();
      await Swal.fire({
        icon: "success",
        title: "Account Deleted Successfully !",
        text: "Now you will be redirected to login page",
      });
      logout();
    }
    else
    {
      console.log("deletion failed")
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
        <Button data-testid="delete-btn" variant="danger" onClick={handleShow}>
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
          <Button
            data-testid="delete-btn-prompt"
            variant="danger"
            onClick={deleteAccount}
          >
            Delete account
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
export default DeleteAccount;
