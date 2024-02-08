import PropTypes from "prop-types";
import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  Modal,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { CheckCircleFill, XCircleFill } from "react-bootstrap-icons";
import { axiosApi } from "../../../utils/axiosApi";
import Swal from "sweetalert2";
import { getComplaintErrorMessages } from "../../../utils/getErrorMessage";
import truncateText from "../../../utils/truncateText";

function ComplaintCard(props) {
  const [show, setShow] = useState(false);

  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      sendResponse();
    }

    setValidated(true);
  };

  const sendResponse = async () => {
    let data = {
      response: document.getElementById("exampleForm.ControlTextarea1").value,
    };
    await axiosApi
      .put(`adminstrator/respond-complaint/${props.complaint.id}/`, data)
      .then((result) => {
        if (result.data?.error_code) {
          console.log(result.data);
          Swal.fire({
            title: "Something went wrong !",
            icon: "error",
            text: getComplaintErrorMessages(result.data?.error_code),
          });
        } else {
          Swal.fire({
            title: "Responded to Complaint",
            icon: "success",
          });
          if (props.complaintListLenght > 1) {
            props.getComplaintsbyPage(props.currentPage);
          } // loads the previous page if current page is empty
          else if (props.hasPrevious) {
            props.getComplaintsbyPage(props.currentPage - 1);
          } // loads the first page is previous not avaliable
          else {
            props.getComplaintsbyPage(1);
          }
          handleClose();
        }
      })
      .catch(function (error) {
        console.log("inside catch" + error);
        Swal.fire({
          title: "Something went wrong !",
          icon: "error",
          text: getComplaintErrorMessages(error?.response?.data?.error_code),
        });
      });
  };
  const handleClose = () => {
    setShow(false);
    setValidated(false);
  };
  const handleShow = () => setShow(true);
  return (
    <Card className="p-3 w-100">
      <Container className="m-0 p-0">
        <Row>
          <Col>
            <Card.Title className="mb-1">
              {truncateText(props.complaint.complaint_title, 30)}
            </Card.Title>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col xl={9}>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>{props.complaint.user.first_name}</Tooltip>}
            >
              <Card.Text
                className="text-secondary"
                style={{ width: "wrap-content" }}
              >
                From {truncateText(props.complaint.user.first_name, 25)}
              </Card.Text>
            </OverlayTrigger>
          </Col>
          <Col xl={3} className="d-flex justify-content-end">
            <Card.Text className="text-secondary">
              Submitted on {props.complaint.created_date}
            </Card.Text>
          </Col>
        </Row>
      </Container>
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
        <Button
          style={{ maxHeight: "40px" }}
          onClick={() => {
            handleShow();
          }}
        >
          View Details
        </Button>
      </div>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header>
          <Modal.Title style={{ wordWrap: "anywhere" }}>
            {props.complaint.complaint_title}
          </Modal.Title>
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip id="closeButtonTooltip">Close</Tooltip>}
          >
            <Button variant="close" onClick={handleClose} />
          </OverlayTrigger>
        </Modal.Header>
        <Modal.Body>
          <div style={{ maxHeight: "50vh", overflowY: "scroll" }}>
            <div className="ms-2">{props.complaint.complaint_body}</div>

            {props.complaint?.complaint_image && (
              <div>
                <h6 className="mt-3 text-center">Attached Image</h6>
                <div className="d-flex justify-content-center">
                  <Image
                    className="mt-2 mb-2"
                    fluid
                    draggable={false}
                    src={
                      process.env.REACT_APP_BASEURL +
                      props.complaint.complaint_image
                    }
                    width={500}
                    height={250}
                    alt="complaint_image"
                  ></Image>
                </div>
              </div>
            )}

            {props.complaint.status === 0 && (
              <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
                className="mt-5 me-2 ms-2"
              >
                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Label className="fw-bold">
                    Your Response (maximum 5000 characters) :
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    required
                    maxLength={5000}
                    onInput={(event) => {
                      const value = event.target.value;
                      const regex = /^(?=(?:[^a-zA-Z]*[a-zA-Z]){3}).*$/;
                      if (!regex.test(value)) {
                        event.target.setCustomValidity(
                          "Input must contain at least three alphabet characters."
                        );
                      } else {
                        event.target.setCustomValidity("");
                      }
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    * Required field (Atleast 3 alphabetic characters required).
                  </Form.Control.Feedback>
                </Form.Group>
                <div className="d-flex justify-content-center mt-5">
                  <Button type="submit" variant="success" className="mt-2 mb-1">
                    Send Response
                  </Button>
                </div>
              </Form>
            )}
            {props.complaint.status === 1 && (
              <Form className="mt-5 me-2 ms-2">
                <Form.Group>
                  <Form.Label className="fw-bold">Your Response:</Form.Label>
                  <Form.Control
                    as="textarea"
                    id="response_txt"
                    rows={3}
                    required
                    maxLength={5000}
                    value={props.complaint.response}
                    disabled
                  />
                </Form.Group>
              </Form>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </Card>
  );
}
ComplaintCard.propTypes = {
  complaint: PropTypes.object,
  getComplaintsbyPage: PropTypes.func,
  currentPage: PropTypes.number,
  complaintListLenght: PropTypes.number,
  hasPrevious: PropTypes.bool,
};
export default ComplaintCard;
