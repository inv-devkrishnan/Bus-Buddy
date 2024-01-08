import { Button } from "react-bootstrap";
import { XOctagonFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "85vh" }}
    >
      <div className="text-center">
        <XOctagonFill size={60} fill="red" className="mb-3"></XOctagonFill>
        <h2>Page Not Found</h2>
        <h6>The Page that you requested no longer exist's</h6>
        <Button
          onClick={() => {
            navigate("/");
          }}
        >
          Go Back to Home Page
        </Button>
      </div>
    </div>
  );
}
export default NotFoundPage;
