import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { useAuthStatus } from "../utils/useAuth";
import { deleteUserAccount } from "../utils/apiCalls";
function DeleteAccountPage() {
  const navigate = useNavigate();
  const authStatus = useAuthStatus();
  useEffect(() => {
    console.log(authStatus.current);
    if (!authStatus.current) {
      navigate("/login");
    }
  }, [authStatus, navigate]);
  
  const deleteAccount = async () => {
    const response = await deleteUserAccount();
    if(response.status)
    {
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login");
    }
  };
  return (
    <Container className="mt-3">
      <h1>Delete Account</h1>
      <div className="ms-3 mt-3">
        <p>
          After deleting your account you have no longer access to the contents of
          this account. <br></br>{" "}
          <span className="fw-bolder">
            Are you sure you want delete this account ?
          </span>
        </p>
        <Button variant="danger" onClick={deleteAccount}>Yes I want delete this account</Button>
      </div>
    </Container>
  );
}
export default DeleteAccountPage;
