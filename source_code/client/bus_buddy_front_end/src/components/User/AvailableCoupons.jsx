import React, { useEffect, useRef, useState, useContext } from "react";
import PropTypes from "prop-types";

import Carousel from "react-bootstrap/Carousel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import { ExclamationCircle } from "react-bootstrap-icons";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";

import Swal from "sweetalert2";
import { showLoadingAlert } from "../common/loading_alert/LoadingAlert";
import { axiosApi } from "../../utils/axiosApi";
import CouponOther from "./CouponOther";
import { UserContext } from "../User/UserContext";

export default function AvailableCoupons(props) {
  const [couponValue, setCouponValue] = useState(""); // for storing the coupon code
  const [couponError, setCouponError] = useState(false);
  const [couponList, setCouponList] = useState([]); // for collecting the coupons data
  const [couponData, setCouponData] = useState(""); // for storing selected coupon data
  const currentTrip = useRef([]);
  const [show, setShow] = useState(false);

  const { updateSelectedCoupon } = useContext(UserContext);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const storedTrip = localStorage.getItem("current_trip");
    currentTrip.current = storedTrip ? JSON.parse(storedTrip) : [];
  }, []);

  useEffect(() => {
    axiosApi
      .get(
        `user/available-coupons/?trip_id=${parseInt(
          currentTrip.current?.data?.trip
        )}`
      )
      .then((res) => {
        setCouponList(res.data);
      })
      .catch((err) => {
        console.log(err);
        console.log(localStorage.getItem("current_trip"));
      });
  }, []);

  const handleChange = (e) => {
    const inputValue = e.target.value;

    const alphanumericRegex = /^[A-Z0-9]+$/;

    if (inputValue === "") {
      setCouponValue("");
      setCouponData("");
      setCouponError(true);
    } else if (alphanumericRegex.test(inputValue)) {
      setCouponValue(inputValue);
      setCouponError(false);
    } else {
      setCouponError(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (couponValue.length < 1 || couponValue.trim().length < 1) {
      setCouponError(true);
    } else {
      showLoadingAlert("Applying coupon");
      setCouponError(false);
      axiosApi
        .get(
          `user/redeem-coupon/?trip_id=${parseInt(
            currentTrip.current?.data?.trip
          )}&coupon_id=${couponData.id}`
        )
        .then((res) => {
          Swal.close();

          if (res.data?.coupon_status === "200") {
            const discount =
              parseFloat(localStorage.getItem("total_amount")) *
              couponData.discount *
              0.01;
            const roundedDiscount = parseFloat(discount);

            props.setTotalAmount(
              parseFloat(
                localStorage.getItem("total_amount") - roundedDiscount
              ).toFixed(2)
            );
            updateSelectedCoupon(couponData.id);
          } else {
            Swal.fire({
              title: "Invalid !",
              icon: "error",
              text: "Invalid coupon",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          Swal.close();
          Swal.fire({
            title: "Oops...!",
            icon: "error",
            text: "Invalid coupon",
          });
        });
    }
  };

  return (
    <div className="d-flex flex-column">
      <div className="d-flex flex-column align-items-center mt-4">
        <h4>Total Amount:</h4>
        <h5 className="border rounded p-2 ">{props?.totalAmount}</h5>
      </div>

      {couponList.length < 1 ? (
        <div className="d-flex m-5">
          <ExclamationCircle color="gray" size={50} />
          <div style={{ color: "gray" }} className="m-2">
            <h4>No coupons are avilable for this trip!</h4>
          </div>
        </div>
      ) : (
        <>
          <div className="h5 d-flex flex-column align-items-center m-2">
            Available Coupons
          </div>

          <Carousel variant="dark" indicators={false}>
            {couponList.map((data) => (
              <Carousel.Item key={data?.id}>
                <div className="d-flex align-items-center justify-content-center">
                  <CouponOther
                    data={data}
                    setCouponValue={setCouponValue}
                    setCouponData={setCouponData}
                    setCouponError={setCouponError}
                  />
                </div>
              </Carousel.Item>
            ))}
          </Carousel>

          <Form onSubmit={handleSubmit}>
            <div className="m-3">
              <InputGroup>
                <Form.Control
                  placeholder="Coupon Code"
                  value={couponValue}
                  onChange={handleChange}
                  minLength={10}
                  maxLength={10}
                  readOnly
                />
                <Button
                  data-testid="apply_coupon"
                  type="submit"
                  variant="outline-primary"
                >
                  Apply Coupon
                </Button>
              </InputGroup>
              <span style={{ fontSize: "11px", color: "GrayText" }}>
                Please copy the code from the coupon. Typing is not permitted in
                this field.
              </span>
              {couponError ? (
                <div style={{ color: "red" }}>
                  Please enter a valid coupon code
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="d-flex flex-column flex-lg-row justify-content-center align-items-center m-4">
              <Button
                data-testid="remove_coupon_button"
                onClick={() => {
                  setCouponValue("");
                  setCouponError(false);
                  props.setTotalAmount(
                    parseFloat(localStorage.getItem("total_amount"))
                  );
                  updateSelectedCoupon([]);
                }}
              >
                Remove Coupon
              </Button>
              &ensp;
              <Button data-testid="all_coupons_button" onClick={handleShow}>
                All Coupons
              </Button>
            </div>
          </Form>
        </>
      )}

      <Modal show={show} onHide={handleClose} centered size="md">
        <Modal.Header closeButton>
          <Modal.Title>Coupon List</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table sx={{ minWidth: 200 }} stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell> Coupon Name</TableCell>
                  <TableCell>Coupon Detail</TableCell>
                  <TableCell>Coupon Code</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {couponList.map((data) => (
                  <TableRow key={data?.id}>
                    <TableCell>
                      <div style={{ wordWrap: "break-word", maxWidth: 200 }}>
                        {data?.coupon_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div style={{ wordWrap: "break-word", maxWidth: 250 }}>
                        {data?.coupon_description}
                      </div>
                    </TableCell>
                    <TableCell>
                      {data?.coupon_code}
                      <Tooltip
                        title="Copy to text field"
                        placement="bottom-start"
                        arrow
                        disableInteractive
                      >
                        <IconButton
                          data-testid="modal_copy_button"
                          onClick={() => {
                            setCouponValue(data?.coupon_code);
                            setShow(false);
                          }}
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
AvailableCoupons.propTypes = {
  totalAmount: PropTypes.number,
  setTotalAmount: PropTypes.func,
};
