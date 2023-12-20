import { Button, Col, Dropdown, Form, Row } from "react-bootstrap";
import { PlusLg } from "react-bootstrap-icons";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import CouponCard from "./CouponCard";
import { useEffect, useRef, useState } from "react";
import { axiosApi } from "../../../utils/axiosApi";
import Swal from "sweetalert2";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import CustomPaginator from "../../common/paginator/CustomPaginator";

function ListCoupon() {
  const navigate = useNavigate();
  const [couponList, setCouponList] = useState([]);
  const couponStatus = useRef(-1);

  const PAGE_LIMIT = 5; // initial number of page numbers that should be shown in the pagination
  const [totalPages, setTotalPages] = useState(0); // to store total pages
  const [currentPage, setCurrentPage] = useState(1); // to get current page
  const [hasPrevious, setHasPrevious] = useState(false); // to check if current page has previous page
  const [hasNext, setHasNext] = useState(false); // to check if current page has next page
  const [pageEndLimit, setPageEndLimit] = useState(PAGE_LIMIT); // end limit of page numbers to be shown in pagination
  const [pageStartLimit, setPageStartLimit] = useState(1); // start limit of page numbers to be shown in pagination

  useEffect(() => {
    getCouponList();
  }, []);

  const getCouponList = async (url) => {
    let default_url = "adminstrator/view-coupon/";
    if (url) {
      default_url = url;
    }
    await axiosApi
      .get(default_url)
      .then((result) => {
        if (result.data?.error_code) {
          Swal.fire({
            title: "Operation Failed",
            text: getErrorMessage(result.data?.error_code),
            icon: "error",
          });
        } else {
          setCouponList(result.data?.coupons);
          setTotalPages(result?.data?.pages);
          setCurrentPage(result?.data?.current_page);
          setCurrentPage(result?.data?.current_page);
          setHasPrevious(Boolean(result?.data?.has_previous));
          setHasNext(Boolean(result?.data?.has_next));
        }
      })
      .catch(function (error) {
        Swal.fire({
          title: "Operation Failed",
          text: getErrorMessage(error?.response?.data?.error_code),
          icon: "error",
        });
      });
  };

  const getCouponsByPage = (page) => {
    let url;
    if (couponStatus.current === -1) {
      url = `adminstrator/view-coupon/?page=${page}`;
    } else {
      url = `adminstrator/view-coupon/?page=${page}&status=${couponStatus.current}`;
    }

    getCouponList(url);
  };
  return (
    <Container fluid className="ms-2 mt-2">
      <Row>
        <Col>
          <h1 className="ms-2">Coupons</h1>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <Button
            variant="success"
            className="ms-2"
            onClick={() => {
              navigate("/admin-dashboard/create-coupon");
            }}
          >
            <PlusLg color="white"></PlusLg> New coupon
          </Button>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <Dropdown>
            <Dropdown.Toggle variant="light">
              View : {couponStatus.current === 0 && "Active Coupons"}
              {couponStatus.current === 1 && "Inactive Coupons"}
              {couponStatus.current === -1 && "All"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => {
                  couponStatus.current = 0;
                  getCouponsByPage(1);
                }}
              >
                Active Coupons
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  couponStatus.current = 1;
                  getCouponsByPage(1);
                }}
              >
                InActive Coupons
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  couponStatus.current = -1;
                  getCouponsByPage(1);
                }}
              >
                All
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col lg={8} className="d-flex justify-content-end me-3">
          <div className="d-flex">
            <Form.Control
              placeholder="Search by coupon name"
              maxLength={50}
              style={{ maxWidth: "250px" }}
            />
            <Button variant="primary" className="ms-2 ">
              Search
            </Button>
          </div>
        </Col>
      </Row>
      <Row className="mt-2 pb-5">
        {couponList.map((coupon) => (
          <Row key={coupon.id}>
            <Col>
              <CouponCard coupon={coupon}></CouponCard>
            </Col>
          </Row>
        ))}
      </Row>
      <Row>
        <CustomPaginator
          PAGE_LIMIT={PAGE_LIMIT}
          totalPages={totalPages}
          currentPage={currentPage}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
          pageStartLimit={pageStartLimit}
          pageEndLimit={pageEndLimit}
          setPageStartLimit={setPageStartLimit}
          setPageEndLimit={setPageEndLimit}
          viewPage={getCouponsByPage}
          width={"70%"}
        ></CustomPaginator>
      </Row>
    </Container>
  );
}
export default ListCoupon;
