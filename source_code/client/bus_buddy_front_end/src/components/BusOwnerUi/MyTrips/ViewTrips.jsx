import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Accordion from "react-bootstrap/Accordion";
import { axiosApi } from "../../../utils/axiosApi";
import Swal from "sweetalert2";
import CustomPaginator from "../../common/paginator/CustomPaginator";

export default function Viewallbus() {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [updateFlag, setUpdateFlag] = useState(false);
  const [order, setOrder] = useState("");
  const [search, setSearch] = useState("");
  const navi = useNavigate();

  const fetchData = useCallback(async (page) => {
    try {
      const response = await axiosApi.get(`bus-owner/view-trip/?page=${page}&search=${search}&ordering=${order}`);
      setData(response.data.results);
      setTotalPages(response.data.total_pages);
      setCurrentPage(response.data.current_page_number);
    } catch (err) {
      console.error("Error:", err);
    }
  }, [order, search]);

  useEffect(() => {
    fetchData(currentPage);
  }, [fetchData, currentPage, updateFlag]);

  const renderCards = () => (
    data.length === 0 ? (
      <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.5rem", marginTop: "20px" }}>
        No data found
      </div>
    ) : (
      data.map((trip) => (
        <div key={trip.id} style={{ marginBottom: "2.5%", borderBlockColor: "black" }}>
          <Accordion defaultActiveKey="1">
            <Accordion.Item eventKey="1" data-testid="accordian-button">
              <Accordion.Header>
                <h4>
                  {trip.start_point_name}-{trip.end_point_name}
                </h4>
              </Accordion.Header>
              <Accordion.Body>
                <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row" }}>
                  <div>
                    <p>Start Date : {trip.start_date}</p>
                    <p>Stop Date : {trip.end_date}</p>
                  </div>
                  <div style={{ display: "flex", marginLeft: "10%", flexDirection: "column" }}>
                    <p>Bus : {trip.bus_name}</p>
                    <p>Route : {trip.start_point_name}-{trip.end_point_name}</p>
                  </div>
                  <div style={{ display: "flex", marginLeft: "10%", flexDirection: "column" }}>
                    <p style={{ maxWidth: "20vw", wordWrap: "break-word" }}>Via :{trip.route.via}</p>
                    <p>Duration :{parseFloat(trip.route.duration).toFixed(2)}</p>
                    <p>Distance :{parseFloat(trip.route.distance).toFixed(2)}</p>
                  </div>
                </div>
                <div style={{ marginBottom: "1%", display: "flex", justifyContent: "space-evenly" }}>
                  <button className="btn btn-primary" onClick={() => update(trip.id)} data-testid="update-button">
                    Update
                  </button>
                  <button className="btn btn-danger" onClick={() => deleted(trip)} data-testid="delete-button">
                    Delete
                  </button>
                  <button className="btn btn-primary" onClick={() => passengers(trip.id)} data-testid="update-button">
                    Passenger List
                  </button>
                </div>
                <p style={{ fontSize: "small", color: "coral" }}>
                  *The end date may have been or may have not been according to the departure date offset set
                </p>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      ))
    )
  );
  

  const handleSearchClick = () => {
    fetchData(currentPage);
  };

  const passengers = (id) => {
    navi("/passengers-list", { state: `${id}` });
  };

  const update = (id) => {
    navi("/BusHome/update-trips", { state: `${id}` });
  };

  const deleted = (trip) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this trip!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosApi
          .put(`bus-owner/delete-trip/${trip.id}/`)
          .then((response) => {
            console.log("Trip deleted successfully");
            Swal.fire({
              icon: "success",
              title: "Deleted",
              text: "Trip Deleted successfully",
            });
            setUpdateFlag((prevFlag) => !prevFlag);
          })
          .catch((error) => {
            console.error("Error adding trip:", error?.response?.data?.message);
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
      }
    });
  };

  return (
    <div>
      <Navbar className="bg-body-tertiary d-flex justify-content-between align-items-center">
        <Link to={"/BusHome/add-trips"} style={{marginLeft:"1%"}}>
          <button className="btn btn-primary"> + Add Trip</button>
        </Link>
        <Form style={{ textAlign: "center" }}>
          <div
            className="input-group"
            style={{ width: "60%", marginLeft: "-10%" }}
          >
            <input
              type="text"
              className="form-control"
              placeholder="Bus name/start/end location"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="btn btn-primary"
              style={{ width: "20%" }}
              type="button"
              onClick={handleSearchClick}
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </Form>
        <h1 style={{marginLeft:"-13%"}}>View All Trips</h1>
        <Dropdown style={{ width: "10%", marginLeft: "1%" }}>
          <Dropdown.Toggle variant="primary" id="dropdown-basic">
            Order By
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setOrder("")}> Latest trip </Dropdown.Item>
            <Dropdown.Item onClick={() => setOrder("-travel_fare")}>
              Trips in descending by date 
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setOrder("travel_fare")}>
              trips in ascending by date
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Link to={"/BusHome/add-recurring-trips"}>
          <button className="btn btn-primary"> + Add Recurring Trip</button>
        </Link>
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
