import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

import { axiosApi } from "../../utils/axiosApi";
import CouponFirstTime from "./CouponFirstTime";
import CouponFestive from "./CouponFestive";
import CouponSelective from "./CouponSelective";
import { useAuthStatus } from "../../utils/hooks/useAuth";
import CouponOther from "./CouponOther";

export default function AvailableCoupons(props) {
  const [couponValue, setCouponValue] = useState("");
  const [couponList, setCouponList] = useState([]);
  const [show, setShow] = useState(false);

  const navigate = useNavigate();
  const authStatus = useAuthStatus();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (authStatus()) {
      axiosApi
        .get("user/available-coupons/?trip_id=4&coupon_id=2")
        .then((res) => {
          setCouponList(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      navigate("/login"); // if user not logged in redirect to login
    }
  }, []);

  const getCuponDesign = (data) => {
    if (data?.coupon_eligibility === 1) {
      return <CouponFirstTime data={data} setCouponValue={setCouponValue} />;
    } else if (data?.coupon_availability === 1) {
      return <CouponSelective data={data} setCouponValue={setCouponValue} />;
    } else if (data?.coupon_availability === 2) {
      return <CouponOther data={data} setCouponValue={setCouponValue} />;
    } else {
      return <CouponFestive data={data} setCouponValue={setCouponValue} />;
    }
  };

  const handleChange = (e) => {
    setCouponValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(couponValue);
    setCouponValue("");
  };

  return (
    <div className="d-flex flex-column">
      <div className="d-flex flex-column align-items-center mt-4">
        <h4>Total Amount:</h4>
        <h5 className="border rounded p-2 ">{props.total}</h5>
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
            Available coupons
          </div>

          <Carousel variant="dark" indicators={false}>
            {couponList.map((data) => (
              <Carousel.Item key={data?.id}>
                <div className="d-flex align-items-center justify-content-center">
                  {getCuponDesign(data)}
                </div>
              </Carousel.Item>
            ))}
          </Carousel>

          <div className="m-3">
            <Form
              onSubmit={handleSubmit}
              className="d-flex flex-column flex-lg-row"
            >
              <InputGroup className="m-3">
                <Form.Control
                  placeholder="Coupon Code"
                  value={couponValue}
                  onChange={handleChange}
                  maxLength={20}
                />
                <Button type="submit" variant="outline-primary">
                  Apply Coupon
                </Button>
              </InputGroup>
              <Button onClick={handleShow}>All Coupons</Button>
            </Form>
          </div>
        </>
      )}

      <Modal show={show} onHide={handleClose} centered size="lg">
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
                    <TableCell>{data?.coupon_name}</TableCell>
                    <TableCell>{data?.coupon_description}</TableCell>
                    <TableCell>
                      {data?.coupon_code}
                      <Tooltip
                        title="Copy to text field"
                        placement="bottom-start"
                        arrow
                        disableInteractive
                      >
                        <IconButton
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
  total: PropTypes.string,
};
