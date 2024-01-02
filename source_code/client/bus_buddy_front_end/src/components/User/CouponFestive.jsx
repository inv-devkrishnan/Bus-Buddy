import React from "react";
import PropTypes from "prop-types";

import { Card, CardImgOverlay, Container, Row, Col } from "react-bootstrap";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import Fest from "../../assets/images/couponFestive.png";

export default function CouponFestive(props) {
  return (
    <Card style={{width:"25rem"}}>
      <Card.Img src={Fest} alt="" />
      <Container>
        <CardImgOverlay>
          <Row>
            <Col xs={3}></Col>
            <Col style={{ marginLeft: 4, marginTop: 25 }}>
              <Card.Title style={{ color: "white", fontSize: "25px" }}>
                {props.data?.coupon_name}
              </Card.Title>
              <Card.Body>
                <Card.Text style={{ color: "white", fontSize: "15px" }}>
                  {props.data?.coupon_description}
                </Card.Text>
                <Card.Text style={{ color: "white", fontSize: "15px" }}>
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
  );
}
CouponFestive.propTypes = {
  setCouponValue: PropTypes.func,
  data: PropTypes.object,
};
