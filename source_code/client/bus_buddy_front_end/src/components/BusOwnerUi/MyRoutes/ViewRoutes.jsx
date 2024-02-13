import React, { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Dropdown from 'react-bootstrap/Dropdown';
import Form from "react-bootstrap/Form";
import { axiosApi } from "../../../utils/axiosApi";
import Accordion from "react-bootstrap/Accordion";
import Swal from "sweetalert2";
import CustomPaginator from "../../common/paginator/CustomPaginator";

export default function Viewallroutes() {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState('');

  const fetchData = useCallback(async (page) => {
    try {
      const response = await axiosApi.get(`bus-owner/view-routes/?page=${page}&search=${search}&ordering=${order}`);
      setData(response.data.results);
      setTotalPages(response.data.total_pages);
      setCurrentPage(response.data.current_page_number);
    } catch (err) {
      console.error("Error:", err);
    }
  }, [order, search]);

  useEffect(() => {
    fetchData(currentPage);
  }, [fetchData, currentPage]);

  const handleSearchClick = () => {
    fetchData(currentPage);
  };

  const renderCards = () => {
    return data.map((viewroutes) => (
      <div key={viewroutes.id} style={{ marginBottom: "2.5%", borderBlockColor: "black" }}>
        <Accordion defaultActiveKey="1">
          <Accordion.Item eventKey="1" data-testid="accordian-button">
            <Accordion.Header>
              <h4>Route : {viewroutes.start_point_name} to {viewroutes.end_point_name}</h4>
            </Accordion.Header>
            <Accordion.Body>
              <div style={{ display: "flex" }}>
                <div>
                  <p>Start Point: {viewroutes.start_point_name}</p>
                  <p>End Point: {viewroutes.end_point_name}</p>
                  <p style={{ maxWidth: "20vw", wordWrap: "break-word" }}>Via: {viewroutes.via}</p>
                </div>
                <div style={{ marginLeft: "10%" }}>
                  <p>Distance: {parseFloat(viewroutes.distance).toFixed(2)}</p>
                  <p>Duration: {parseFloat(viewroutes.duration).toFixed(2)}</p>
                  <p>Travel Fare: {parseFloat(viewroutes.travel_fare).toFixed(2)}</p>
                </div>
                <div style={{ marginLeft: "10%" }}>
                  <p>Start Time: {viewroutes.start_time}</p>
                  <p>Stop Time: {viewroutes.stop_time}</p>
                </div>
              </div>
              <div style={{ marginBottom: "1%", display: "flex", justifyContent: "space-evenly" }}>
                <button className="btn btn-danger" onClick={() => confirmDelete(viewroutes.id)} data-testid="delete-button">
                  Delete
                </button>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    ));
  };

  const confirmDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this route!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteRoute(id);
      }
    });
  };

  const deleteRoute = (id) => {
    axiosApi
      .put(`bus-owner/delete-routes/${id}/`)
      .then((response) => {
        console.log("Route deleted successfully");
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Route Deleted successfully",
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
          text: "Error Deleting Route",
        });
      });
  };

  return (
  <div>
    <Navbar className="bg-body-tertiary d-flex justify-content-between align-items-center">
      <Dropdown style={{ width: "10%", marginLeft: "1%" }}>
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          Filter By
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setOrder('')}> Latest </Dropdown.Item>
          <Dropdown.Item onClick={() => setOrder("-travel_fare")}>Travel Fair high - low</Dropdown.Item>
          <Dropdown.Item onClick={() => setOrder("travel_fare")}>Travel Fair low - high</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Form style={{ textAlign: "center" }}>
        <div className="input-group" style={{ width: "60%",marginLeft:"-80%" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-primary" style={{ width: "20%" }} type="button" onClick={handleSearchClick}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </Form>
      <h1  style={{ marginLeft: "-50%" }}>View All Routes</h1>
      <Form style={{ textAlign: "center" }}>
        <Link to={"/BusHome/Addroutes"}>
          <button className="btn btn-primary">+ Add Routes</button>
        </Link>
      </Form>
    </Navbar>
    <div className="card-container">{renderCards()}</div>
    <div style={{ display: "flex", justifyContent: "center", margin: "20px", alignItems: "center", flexDirection: "column" }}>
      <CustomPaginator totalPages={totalPages} currentPage={currentPage} viewPage={fetchData} />
    </div>
  </div>
);
}
