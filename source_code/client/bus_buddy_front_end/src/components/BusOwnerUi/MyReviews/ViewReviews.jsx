import React, { useEffect, useState,useCallback } from "react";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";
import { axiosApi } from "../../../utils/axiosApi";
import { StarFill } from 'react-bootstrap-icons';
import { Badge } from "react-bootstrap";
import CustomPaginator from "../../common/paginator/CustomPaginator";


export default function Viewallbus() {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage,setCurrentPage] = useState(1)

  const fetchData = useCallback(async (page) => {
    try {
      const response = await axiosApi.get(
        `bus-owner/view-reviews/?page=${page}`
      );
      setData(response.data.results);
      console.log(response.data.results);
      setTotalPages(response.data.total_pages);
      setCurrentPage(response.data.current_page_number);
    }
    catch(err) {
      console.error("Error:", err);}
    
  }, []);

  useEffect(() => {
    fetchData(currentPage);
  }, [fetchData,currentPage,]);


  const getBadgeColor = (rate) => {
    switch (rate) {
      case 0:
        return "secondary";
      case 1:
        return "danger";
      case 2:
        return "warning";
      case 3:
        return "info";
      case 4:
        return "primary";
      case 5:
        return "success";
      default:
        return "dark";
    }
  };

  
  const renderCards = () => {
    return data.map((viewreview) => (
      <div
        key={viewreview.id}
        style={{ marginBottom: "2.5%", borderBlockColor: "black" }}
      >
        <Accordion defaultActiveKey="1">
          <Accordion.Item eventKey="1" data-testid = "accordian-button">
            <Accordion.Header>
              <h4>Title : {viewreview.review_title}</h4>
            </Accordion.Header>
            <Accordion.Body>
              <div style={{ display: "flex" }}>
                <div>
                  <p>{viewreview.review_body}</p>
                  <p>
                    Rating :&nbsp;
                    <Badge bg={getBadgeColor(viewreview.rating)}>
                        {viewreview.rating} &nbsp;
                      <StarFill />
                    </Badge>
                  </p>
                  <p>Review By : {viewreview.user_id.first_name}  {viewreview.user_id.last_name}</p>
                  <p>Email Id : {viewreview.user_id.email} </p>
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    ));
  };

  return (
    <div>
      <Navbar className="bg-body-tertiary d-flex justify-content-between align-items-center">
        <h1 className="mx-auto">Viewall Reviews</h1>
        <Form style={{ textAlign: "center" }}></Form>
      </Navbar>
      <div className="card-container">{renderCards()}</div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "20px",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <CustomPaginator
          totalPages={totalPages}
          currentPage={currentPage}
          viewPage={fetchData}
        />
      </div>
    </div>
  );
}
