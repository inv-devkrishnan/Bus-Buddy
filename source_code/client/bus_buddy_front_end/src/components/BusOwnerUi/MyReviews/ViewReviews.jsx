import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";
import { axiosApi } from "../../../utils/axiosApi";
import Swal from "sweetalert2";
import { Pagination } from "react-bootstrap";

export default function Viewallbus() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [next, setNext] = useState(1);
  const [previous, setPrevious] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [active, setActive] = useState(1);

  const navi = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosApi.get(
        `http://localhost:8000/bus-owner/view-reviews/?page=${page}`
      );
      setData(response.data.results);
      console.log(response.data.results);
      setNext(response.data.has_next);
      setPrevious(response.data.has_previous);
      setTotalPages(response.data.total_pages);
    };
    fetchData();
  }, [page]);
  const handlePrevious = () => {
    setActive(active - 1);
    setPage(page - 1);
  };

  const handleNext = () => {
    setActive(active + 1);
    setPage(page + 1);
  };

  let items = [];
  for (let number = 1; number <= totalPages; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === active}
        onClick={() => {
          setActive(number);
          setPage(number);
        }}
      >
        {number}
      </Pagination.Item>
    );
  }

  const paginationBasic = (
    <div>
      <Pagination>
        <Pagination.First
          onClick={() => {
            setActive(1);
            setPage(1);
          }}
        />
        {previous ? (
          <Pagination.Prev onClick={handlePrevious} />
        ) : (
          <Pagination.Prev onClick={handlePrevious} disabled />
        )}
        {items}
        {next ? (
          <Pagination.Next onClick={handleNext} />
        ) : (
          <Pagination.Next onClick={handleNext} disabled />
        )}
        <Pagination.Last
          onClick={() => {
            setActive(totalPages);
            setPage(totalPages);
          }}
        />
      </Pagination>
    </div>
  );


  const renderCards = () => {
    return data.map((viewreview) => (
      <div
        key={viewreview.id}
        style={{ marginBottom: "2.5%", borderBlockColor: "black" }}
      >
        <Accordion defaultActiveKey="1">
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <h4>Name : {viewreview.review_title}</h4>
            </Accordion.Header>
            <Accordion.Body>
              <div style={{ display: "flex" }}>
                <div>
                  <p>{viewreview.review_body}</p>
                  <p>Ratings:{viewreview.rating}</p>
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
      <h1 className="mx-auto">Viewall</h1>
      <Form style={{ textAlign: "center" }}>
      </Form>
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
        {paginationBasic}
      </div>
    </div>
  );
}
