import PropTypes from "prop-types";
import { Button, Card } from "react-bootstrap";
import { CheckCircleFill, XCircleFill } from "react-bootstrap-icons";

function ComplaintCard(props) {
  return (
    <Card className="p-3 me-3" style={{ width: "90%" }}>
      <div className="d-flex justify-content-between align-items-top">
        <div>
          <Card.Title className="mb-1">
            {props.complaint.complaint_title}
          </Card.Title>
          <Card.Text className="text-secondary">
            From {props.complaint.user.first_name}
          </Card.Text>
        </div>
        <Card.Text className="text-secondary">
          Submitted on {props.complaint.created_date}
        </Card.Text>
      </div>
      <div className="d-flex justify-content-between">
        <div>
          {props.complaint.status === 0 && (
            <div className="d-flex mt-2">
              <Card.Text>Not responded </Card.Text>
              <XCircleFill color="red" className="ms-2 mt-1"></XCircleFill>
            </div>
          )}
          {props.complaint.status === 1 && (
            <div className="d-flex mt-2">
              <Card.Text>Responded </Card.Text>
              <CheckCircleFill
                color="green"
                className="ms-2 mt-1"
              ></CheckCircleFill>
            </div>
          )}
        </div>
        <Button style={{ maxHeight: "40px" }}>View Details</Button>
      </div>
    </Card>
  );
}
ComplaintCard.propTypes = {
  complaint: PropTypes.object,
};
export default ComplaintCard;
