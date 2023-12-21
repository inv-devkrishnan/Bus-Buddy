import { Button, Col, Dropdown, Form, ProgressBar, Row } from "react-bootstrap";
import { ExclamationCircle, PlusLg } from "react-bootstrap-icons";
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

  const [searchMode, setSearchMode] = useState(false);
  const [searchEnabled, setSearchEnabled] = useState(false);

  const [couponListLoading, setCouponListLoading] = useState(false);

  const PAGE_LIMIT = 5; // initial number of page numbers that should be shown in the pagination
  const [totalPages, setTotalPages] = useState(0); // to store total pages
  const [currentPage, setCurrentPage] = useState(1); // to get current page
  const [hasPrevious, setHasPrevious] = useState(false); // to check if current page has previous page
  const [hasNext, setHasNext] = useState(false); // to check if current page has next page
  const [pageEndLimit, setPageEndLimit] = useState(PAGE_LIMIT); // end limit of page numbers to be shown in pagination
  const [pageStartLimit, setPageStartLimit] = useState(1); // start limit of page numbers to be shown in pagination

  let searchbox = document.getElementById("search_box");
  useEffect(() => {
    getCouponList();
  }, []);

  const getCouponList = async (url) => {
    let default_url = "adminstrator/view-coupon/";
    if (url) {
      default_url = url;
    }
    setCouponListLoading(true);
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
    setCouponListLoading(false);
  };

  const getCouponsByPage = (page) => {
    let url;
    if (searchbox.value) {
      if (couponStatus.current === -1) {
        url = `adminstrator/view-coupon/?page=${page}&search=${searchbox.value}`;
      } else {
        url = `adminstrator/view-coupon/?page=${page}&status=${couponStatus.current}&search=${searchbox.value}`;
      }
      console.log("in search mode");
    } else {
      if (couponStatus.current === -1) {
        url = `adminstrator/view-coupon/?page=${page}`;
      } else {
        url = `adminstrator/view-coupon/?page=${page}&status=${couponStatus.current}`;
      }
      console.log("in normal mode");
    }

    getCouponList(url);
  };

  const renderLoading = (
    <div className="mt-5">
      <ProgressBar animated now={100} className="w-25 ms-auto me-auto" />
      <p className="ms-3 mt-3 text-center">Please Wait</p>
    </div>
  );

  const renderCouponList =
    couponList.length > 0 ? (
      couponList.map((coupon) => (
        <Row key={coupon.id}>
          <Col xxl={12} xl={12} lg={12} md={12}>
            <CouponCard coupon={coupon}></CouponCard>
          </Col>
        </Row>
      ))
    ) : (
      <div className="mt-5">
        <div className="d-flex justify-content-center">
          <ExclamationCircle size={36}></ExclamationCircle>
        </div>
        <h3 className="text-center mt-3">List empty !</h3>
      </div>
    );
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
        <Col xxl={1} xl={2} lg={3}>
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
        <Col
          xxl={11}
          xl={10}
          lg={9}
          md={12}
          sm={12}
          xs={11}
          className="d-flex justify-content-end"
          style={{ marginLeft: "-2%" }}
        >
          <div className="d-flex justify-content-start ">
            <Form.Control
              id="search_box"
              placeholder="Search by coupon name"
              onChange={(e) => {
                e.target.value.length > 0
                  ? setSearchEnabled(true)
                  : setSearchEnabled(false);
              }}
              maxLength={50}
              disabled={searchMode}
              style={{ maxWidth: "250px" }}
            />
            {searchMode ? (
              <Button
                variant="danger"
                className="ms-2 "
                onClick={() => {
                  setSearchMode(false);
                  searchbox.value = "";
                  setSearchEnabled(false);
                  getCouponsByPage(1);
                }}
              >
                Clear
              </Button>
            ) : (
              <Button
                variant="primary"
                className="ms-2 "
                disabled={!searchEnabled}
                onClick={() => {
                  if (searchbox.value) {
                    setSearchMode(true);
                    getCouponsByPage(1);
                  }
                }}
              >
                Search
              </Button>
            )}
          </div>
        </Col>
      </Row>
      {searchMode && (
        <Row className="mt-2">
          <Col>
            <h2>Search result for "{searchbox.value}"</h2>
          </Col>
        </Row>
      )}
      <Row className="mt-2 pb-5">
        {couponListLoading ? renderLoading : renderCouponList}
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
