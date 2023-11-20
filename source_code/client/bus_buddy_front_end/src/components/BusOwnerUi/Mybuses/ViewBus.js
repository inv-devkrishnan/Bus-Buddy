import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Accordion from "react-bootstrap/Accordion";
import { axiosApi } from "../../../utils/axiosApi";
import Swal from "sweetalert2";
import { Pagination } from "react-bootstrap";

export default function Viewallbus() {
  const [data, setData] = useState([]);
  const [amenitiesData, setAmenitiesData] = useState([]);
  const [pageSize, setPageSize] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [page, setPage] = useState(1);
  const [next, setNext] = useState(1);
  const [previous, setPrevious] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [active, setActive] = useState(1);

  const navi = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosApi.get(
        `http://localhost:8000/bus-owner/view-bus/?page=${page}`
      );
      setData(response.data.results);
      console.log(response.data.results);
      setNext(response.data.has_next);
      setPrevious(response.data.has_previous);
      setTotalPages(response.data.total_pages);
      setCurrentPage(response.data.current_page_number);
      setPageSize(response.data.page_size);
      setAmenitiesData(response.data.results);
    };
    fetchData();
  }, [page]);
  const list = amenitiesData[0];
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
    return data.map((viewbus) => (
      <div
        key={viewbus.id}
        style={{ marginBottom: "2.5%", borderBlockColor: "black" }}
      >
        <Accordion defaultActiveKey="1">
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <h5>Name : {viewbus.bus_name}</h5>
            </Accordion.Header>
            <Accordion.Body>
              <div style={{ display: "flex" }}>
                <div>
                  <p>Bus ID : {viewbus.id}</p>
                  <p>Plate No : {viewbus.plate_no}</p>
                </div>
                <div style={{ marginLeft: "10%" }}>
                  {viewbus.bus_type === 0 ? (
                    <p>Bus Type : Low Floor</p>
                  ) : viewbus.bus_type === 1 ? (
                    <p>Bus Type : Multi Axle</p>
                  ) : (
                    <p>Bus Type : Multi Axle Low Floor</p>
                  )}

                  {viewbus.bus_ac === 0 ? (
                    <p>Bus A/C : A/C</p>
                  ) : viewbus.bus_ac === 1 ? (
                    <p>Bus A/C : Non A/C</p>
                  ) : (
                    <p>Bus A/C : Unknown</p>
                  )}
                </div>
              </div>
              <div
                style={{
                  marginBottom: "1%",
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
              >
                <button
                  className="btn btn-primary"
                  onClick={() => update(viewbus.id)}
                >
                  Update
                </button>
                <button
                  className="btn btn-primary"
                  onClick={()=>addSeatDetails(viewbus.id)}
                >
                  Seat Details
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => deleted(viewbus.id)}
                >
                  Delete
                </button>
              </div>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="0" onClick={() => viewbus.id}>
            <Accordion.Header>Amenities of {viewbus.bus_name}</Accordion.Header>
            <Accordion.Body>
              {viewbus.amenities_data && viewbus.amenities_data.length > 0 ? (
                <>
                  <p>Do you want to update the existing amenities?</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => updateAmenities(viewbus.id)}
                  >
                    Update amenities
                  </button>
                </>
              ) : (
                <>
                  <p>
                    There are no Amenities added for this bus. Please add
                    amenities for your bus.
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => addAmenities(viewbus.id)}
                  >
                    Add amenities
                  </button>
                </>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    ));
  };

  const addAmenities = (id) => {
    navi("/Addamenities", { state: `${id}` });
  };

  const updateAmenities = (id) => {
    navi("/Updateamenities", { state: `${id}` });
  };
  const update = (id) => {
    navi("/UpdateBus", { state: `${id}` });
  };
  const addSeatDetails = (id) => {
    navi("/full-sleeper-details", {
      state:  `${id}` })
  }
  const deleted = (id) => {
    axiosApi
      .put(`http://127.0.0.1:8000/bus-owner/delete-bus/${id}/`)
      .then((response) => {
        console.log("bus deleted successfuly");
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Bus Deleted successfully",
        });
      })
      .catch((error) => {
        if (error.response) {
          console.log("HTTP status code:", error.response.status);
        } else {
          console.error("An error occurred:", error.message);
        }
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error Deleting Bus",
        });
      });
  };

  return (
    <div>
      <Navbar className="bg-body-tertiary justify-content-between">
        <Form
          style={{ textAlign: "center", marginLeft: "25%", marginTop: "1%" }}
        >
          <h1>Viewall</h1>
        </Form>
        <Form inline>
          <Row>
            <Col xs="auto">
              <Form.Control
                type="text"
                placeholder="Search"
                className=" mr-sm-2"
              />
            </Col>
            <Col xs="auto">
              <Button type="submit">Submit</Button>
            </Col>
          </Row>
        </Form>
      </Navbar>
      <div className="card-container">{renderCards()}</div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "20px",
          flexDirection: "column",
        }}
      >
        {paginationBasic}
        <Link to={"/AddBus"}>
          <button className="btn btn-primary"> + Add Bus</button>
        </Link>
      </div>
    </div>
  );
}
