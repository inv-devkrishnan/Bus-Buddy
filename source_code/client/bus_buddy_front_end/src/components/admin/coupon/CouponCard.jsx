import PropTypes from "prop-types";
import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Modal,
  Form,
} from "react-bootstrap";
import { CheckCircleFill, XCircleFill } from "react-bootstrap-icons";
import Swal from "sweetalert2";
import { showLoadingAlert } from "../../common/loading_alert/LoadingAlert";
import { axiosApi } from "../../../utils/axiosApi";
import { getCouponErrorMessages } from "../../../utils/getErrorMessage";

function CouponCard(props) {
  const [showCouponDetails, setShowCouponDetails] = useState(false); // state variable to show/hide coupon details

  const handleClose = () => setShowCouponDetails(false); // function to close coupon details modal
  const handleShow = () => setShowCouponDetails(true); // function to open coupon details modal

  const showDialog = (dialogData) => {
    return Swal.fire({
      title: dialogData.title,
      text: dialogData.text,
      icon: dialogData.icon,
      confirmButtonText: dialogData.confirmButtonText,
      confirmButtonColor: dialogData.confirmButtonColor,
      showCancelButton: dialogData.showCancelButton,
      cancelButtonText: dialogData.cancelButtonText,
    });
  };

  const displayErrorMessage = (error) => {
    // function to display error message
    Swal.fire({
      title: "Something went wrong !",
      icon: "error",
      text: getCouponErrorMessages(error?.response?.data?.error_code),
    });
  };
  const fireSuccessMessage = (title) => {
    // function to show success message
    Swal.fire({
      title: title,
      icon: "success",
    });
  };

  const fireErrorMessage = (title, text) => {
    // function to fire specific error message
    Swal.fire({
      title: title,
      text: text,
      icon: "error",
    });
  };

  const refreshCouponList = () => {
    // reloads current page
    if (props.couponListLenght > 1) {
      props.getCouponsByPage(props.currentPage);
    } // loads the previous page if current page is empty
    else if (props.hasPrevious) {
      props.getCouponsByPage(props.currentPage - 1);
    } // loads the first page is previous not avaliable
    else {
      props.getCouponsByPage(1);
    }
  };

  const showResponseDialog = (result, operation) => {
    switch (operation) {
      case "delete":
        if (result.data?.error_code) {
          fireErrorMessage(
            "Coupon Deletion Failed !",
            getCouponErrorMessages(result.data?.error_code)
          );
        } else if (result.data?.success_code) {
          fireSuccessMessage("Coupon Deleted !");
        }
        break;
      case "activate":
        if (result.data?.error_code) {
          fireErrorMessage(
            "Coupon Activation Failed !",
            getCouponErrorMessages(result.data?.error_code)
          );
        } else if (result.data?.success_code) {
          fireSuccessMessage("Coupon Activated !");
        }
        break;
      case "deactivate":
        if (result.data?.error_code) {
          fireErrorMessage(
            "Coupon Deativation Failed",
            getCouponErrorMessages(result.data?.error_code)
          );
        } else if (result.data?.success_code) {
          fireSuccessMessage("Coupon Deactivated !");
        }
        break;
      default:
        Swal.fire({
          title: "Operation Failed",
          text: "Operation Failed due to uknown error",
          icon: "error",
        });
    }
  };

  const deleteCoupon = async (coupon_id) => {
    //shows dialog
    const deleteCoupondata = {
      title: "Delete Coupon",
      text: "Are you sure you want to Delete this Coupon ",
      icon: "warning",
      confirmButtonText: "Delete coupon",
      confirmButtonColor: "#f0ad4e",
      showCancelButton: true,
      cancelButtonText: "Cancel",
    };
    // if dialog is confirmed
    if ((await showDialog(deleteCoupondata)).isConfirmed) {
      showLoadingAlert("Deleting Coupon");
      await axiosApi
        .put(`adminstrator/delete-coupon/${coupon_id}/`)
        .then((result) => {
          Swal.close();
          showResponseDialog(result, "delete");
          refreshCouponList();
        })
        .catch(function (error) {
          // display error message
          Swal.close();
          displayErrorMessage(error);
        });
    }
  };

  const activateCoupon = async (coupon_id) => {
    //shows dialog
    const activateCoupondata = {
      title: "Activate Coupon",
      text: "Are you sure you want to Activate this Coupon ",
      icon: "warning",
      confirmButtonText: "Activate coupon",
      confirmButtonColor: "#f0ad4e",
      showCancelButton: true,
      cancelButtonText: "Cancel",
    };
    // if dialog is confirmed
    if ((await showDialog(activateCoupondata)).isConfirmed) {
      showLoadingAlert("Activating Coupon");
      await axiosApi
        .put(`adminstrator/activate-coupon/${coupon_id}/`)
        .then((result) => {
          Swal.close();
          showResponseDialog(result, "activate");
          refreshCouponList();
        })
        .catch(function (error) {
          // display error message
          Swal.close();
          displayErrorMessage(error);
        });
    }
  };

  const deactivateCoupon = async (coupon_id) => {
    // function to deactivate coupon
    //shows dialog
    const deactivateCoupondata = {
      title: "Deactivate Coupon",
      text: "Are you sure you want to deactivate this Coupon ",
      icon: "warning",
      confirmButtonText: "Deactivate coupon",
      confirmButtonColor: "#f0ad4e",
      showCancelButton: true,
      cancelButtonText: "Cancel",
    };
    // if dialog is confirmed
    if ((await showDialog(deactivateCoupondata)).isConfirmed) {
      showLoadingAlert("Deactivating Coupon");
      await axiosApi
        .put(`adminstrator/deactivate-coupon/${coupon_id}/`)
        .then((result) => {
          Swal.close();
          showResponseDialog(result, "deactivate");
          refreshCouponList();
        })
        .catch(function (error) {
          // display error message
          Swal.close();
          displayErrorMessage(error);
        });
    }
  };
  return (
    <Card className="p-3 w-100">
      <Card.Title>{props.coupon.coupon_name}</Card.Title>
      <Card.Text className="text-secondary">
        Coupon Code :{" "}
        <span className="fw-bold">{props.coupon.coupon_code}</span>
      </Card.Text>
      <div className="d-flex align-items-center">
        <Container>
          <Row>
            <Col md={12} lg={6} xl={5} xxl={4}>
              <Card.Text>
                <li>
                  Valid till :{" "}
                  <span className="fw-bold">{props.coupon.valid_till}</span>
                </li>
              </Card.Text>
            </Col>
            <Col md={12} lg={6} xl={4} xxl={4}>
              <Card.Text>
                <li>
                  One Time Use{" "}
                  {props.coupon.one_time_use === 0 && (
                    <CheckCircleFill
                      color="green"
                      className="mb-1"
                    ></CheckCircleFill>
                  )}
                  {props.coupon.one_time_use === 1 && (
                    <XCircleFill color="red" className="mb-1"></XCircleFill>
                  )}
                </li>
              </Card.Text>
            </Col>
            <Col md={12} lg={6} xl={4}>
              <Card.Text>
                <li>
                  Discount :{" "}
                  <span className="fw-bold">{props.coupon.discount} %</span>
                </li>
              </Card.Text>
            </Col>
          </Row>
        </Container>
        <Container className="p-0 m-0 w-75">
          <Row>
            <Col
              xxl={4}
              xl={4}
              lg={5}
              md={"auto"}
              sm={12}
              className=" mb-1 p-0"
            >
              <Button
                style={{ width: "117px" }}
                onClick={() => {
                  handleShow();
                }}
              >
                View Details
              </Button>
            </Col>
            <Col
              xxl={4}
              xl={4}
              lg={5}
              md={"auto"}
              sm={12}
              className=" mb-1 p-0"
            >
              <Button
                style={{ width: "117px" }}
                variant="danger"
                onClick={() => {
                  deleteCoupon(props.coupon.id);
                }}
              >
                Delete
              </Button>
            </Col>
            <Col xxl={4} xl={4} lg={5} md={"auto"} sm={12} className="mb-1 p-0">
              {props.coupon.status === 0 && (
                <Button
                  style={{ width: "117px" }}
                  variant="warning"
                  onClick={() => {
                    deactivateCoupon(props.coupon.id);
                  }}
                >
                  Deactivate
                </Button>
              )}
              {props.coupon.status === 1 && (
                <Button
                  style={{ width: "117px" }}
                  variant="success"
                  onClick={() => {
                    activateCoupon(props.coupon.id);
                  }}
                >
                  Activate
                </Button>
              )}
            </Col>
          </Row>
        </Container>
        <Modal show={showCouponDetails} onHide={handleClose} centered backdrop="static"
        keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>Coupon Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h6>Coupon Description</h6>
            <Form.Control
              as="textarea"
              rows={3}
              required
              value={props.coupon.coupon_description}
              readOnly
              maxLength={500}
            />
            <h6 className="mt-2">Coupon Eligibility</h6>
            <li className="ms-3">
              {props.coupon.coupon_eligibility === 0 && "Everyone"}
              {props.coupon.coupon_eligibility === 1 && "First Booking"}
            </li>
            <h6 className="mt-2">Coupon Availability</h6>
            <li className="ms-3">
              {props.coupon.coupon_availability === 0 && "All Trips"}
              {props.coupon.coupon_availability === 1 &&
                "Only for " + props.coupon?.user?.company_name + " trips"}
              {props.coupon.coupon_availability === 2 &&
                "Only for the trip " +
                  props.coupon?.trip?.route?.start_point?.location_name +
                  " to " +
                  props.coupon?.trip?.route?.end_point?.location_name +
                  " on " +
                  props.coupon?.trip?.start_date}
            </li>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Card>
  );
}
CouponCard.propTypes = {
  coupon: PropTypes.object,
  getCouponsByPage: PropTypes.func,
  currentPage: PropTypes.number,
  couponListLenght: PropTypes.number,
  hasPrevious: PropTypes.bool,
};
export default CouponCard;
