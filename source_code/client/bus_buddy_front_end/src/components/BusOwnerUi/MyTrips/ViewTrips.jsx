import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pagination } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import Accordion from "react-bootstrap/Accordion";
import { axiosApi } from "../../../utils/axiosApi";
import Swal from "sweetalert2";



export default function Viewallbus() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [next, setNext] = useState(1);
  const [previous, setPrevious] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [active, setActive] = useState(1);
  const [updateFlag, setUpdateFlag] = useState(false);

  const navi = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosApi.get(
        `http://localhost:8000/bus-owner/view-trip/?page=${page}`
      );
      setData(response.data.results);
      setNext(response.data.has_next);
      setPrevious(response.data.has_previous);
      setTotalPages(response.data.total_pages);
      console.log(response.data);
    };
    fetchData();
  }, [page,updateFlag]);
  console.log(data);

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
    return data.map((trip) => (
      <div key={trip.id} style={{ marginBottom: "2.5%",borderBlockColor:"black"}}>
        <Accordion defaultActiveKey="1">
          <Accordion.Item eventKey="1" data-testid = "accordian-button">
            <Accordion.Header>
              <h4>{trip.start_point_name}-{trip.end_point_name}</h4>
            </Accordion.Header>
            <Accordion.Body>
              <div style={{ display: "flex",justifyContent:"space-between",flexDirection:"row" }}>
                <div>
                <p>Start Date : {trip.start_date}</p>
                <p>Stop Date : {trip.end_date}</p>
                </div>
                <div style={{display:"flex",marginLeft:"10%",flexDirection:"column"}}>
                <p>Bus : {trip.bus_name}</p>
                <p>Route : {trip.start_point_name}-{trip.end_point_name}</p>
                </div>
                <div style={{ marginLeft: "10%" }}>
                <p>

                </p>   
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
                  onClick={() => update(trip.id)}
                  data-testid = "update-button"
                >
                  Update
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => deleted(trip)}
                  data-testid = "delete-button"
                >
                  Delete
                </button>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    ));
  };


  const update = (id) => {
    navi("/update-trips", { state: `${id}` });
  };
  const deleted = (trip) => {
    console.log(trip)
    
    axiosApi
      .put(`http://127.0.0.1:8000/bus-owner/delete-trip/${trip.id}/`)
      .then((response) => {
        console.log("bus deleted successfuly");

        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Trip Deleted successfully",
        });
        setUpdateFlag((prevFlag) => !prevFlag);
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
          text: "Error Deleting Trip",
        });
      });
  };

  return (
    <div>
      <Navbar className="bg-body-tertiary d-flex justify-content-between align-items-center">
          <Link to={"/add-trips"}>
            <button className="btn btn-primary"> + Add Trip</button>
          </Link>
      <h1 className="mx-auto">Viewall</h1>
          <Link to={"/add-recurring-trips"}>
            <button className="btn btn-primary"> + Add Recurring Trip</button>
          </Link>
    </Navbar>
      <div className="card-container">{renderCards()}</div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "20px",
          alignItems:"center",
          flexDirection:"column"
        }}
      >
        {paginationBasic}
      </div>
    </div>
  );
}
