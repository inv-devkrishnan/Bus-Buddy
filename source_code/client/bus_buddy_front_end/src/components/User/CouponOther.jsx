import React, { useState } from "react";
import PropTypes from "prop-types";

import { Card, CardImgOverlay, Container, Row, Col } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { FileText } from "react-bootstrap-icons";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import Other from "../../assets/images/couponOther.png";

export default function CouponOther(props) {
  const description = props.data?.coupon_description;
  const description_length = description.length;
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Card style={{ width: "20rem" }}>
        <Card.Img src={Other} alt="" />
        <Container>
          <CardImgOverlay>
            <Row>
              <Col style={{ marginTop: 10 }}>
                <Card.Title
                  style={{ color: "lightgoldenrodyellow", fontSize: "20px" }}
                >
                  {props.data?.coupon_name}
                </Card.Title>
                <Card.Body>
                  <Card.Text
                    style={{
                      color: "lightgoldenrodyellow",
                      fontSize: "15px",
                      marginLeft: 60,
                    }}
                  >
                    {description_length > 88 ? (
                      <Tooltip
                        title="Read description"
                        placement="bottom-start"
                        arrow
                        disableInteractive
                      >
                        <IconButton
                          style={{ marginLeft: 10 }}
                          onClick={() => handleShow()}
                        >
                          <FileText color="white" />
                          <div style={{ color: "white", fontSize: "15px" }}>
                            &ensp; Description
                          </div>
                        </IconButton>
                      </Tooltip>
                    ) : (
                      props.data?.coupon_description
                    )}
                  </Card.Text>
                  <Card.Text
                    style={{
                      color: "lightgoldenrodyellow",
                      fontSize: "15px",
                      marginLeft: 70,
                    }}
                  >
                    {props.data?.coupon_code}
                    &nbsp;
                    <Tooltip
                      title="Copy to text field"
                      placement="bottom-start"
                      arrow
                      disableInteractive
                    >
                      <IconButton
                        onClick={() => {
                          props.setCouponValue(props.data?.coupon_code);
                          props.setCouponData(props?.data);
                          props.setCouponError(false);
                        }}
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </Tooltip>
                  </Card.Text>
                </Card.Body>
              </Col>
            </Row>
          </CardImgOverlay>
        </Container>
      </Card>

      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Coupon List</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.data?.coupon_description}</Modal.Body>
      </Modal>
    </>
  );
}
CouponOther.propTypes = {
  setCouponValue: PropTypes.func,
  data: PropTypes.object,
  setCouponData: PropTypes.func,
  setCouponError: PropTypes.func,
};
