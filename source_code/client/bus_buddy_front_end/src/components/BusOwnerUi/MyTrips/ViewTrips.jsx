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
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { showLoadingAlert } from "../../common/loading_alert/LoadingAlert";


export default function Viewallbus() {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [updateFlag, setUpdateFlag] = useState(false);
  const [order, setOrder] = useState(3);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navi = useNavigate();

  const fetchData = useCallback(
    async (page) => {
      showLoadingAlert("Fetching Trips");


      try {
        const response = await axiosApi.get(
          `bus-owner/view-trip/?page=${page}&search=${search}&ordering=${order}`
        );
        setData(response.data.results);
        setTotalPages(response.data.total_pages);
        setCurrentPage(response.data.current_page_number);
        Swal.close();
        setIsLoading(false)
      } catch (err) {
        Swal.close();
        setIsLoading(false)
        console.error("Error:", err);
      }
    },
    [order, search]
  );

  const handleButtonClick = async (id) => {
    try {
      const response = await axiosApi.get(
        `bus-owner/pick-and-drop-stops/${id}/`
      );
      console.log(response);
      setModalData({ ...response.data });
      setShowModal(true); // Show the modal after successful API call
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  const routeDetailsModal = (data) => {
    console.log(data.data)
    return (
      <Modal.Body>
      <table style={{ width: "100%" }}>
        <tbody>
          <tr>
            <th style={{ fontWeight: "bold", textAlign: "left" }}>Location</th>
            <th style={{ fontWeight: "bold", textAlign: "left" }}>Bus Stop</th>
            <th style={{ fontWeight: "bold", textAlign: "left" }}>Landmark</th>
            <th style={{ fontWeight: "bold", textAlign: "left" }}>Arrival Time</th>
          </tr>
          {data?.data?.map((item) => (
            <React.Fragment key={item.start_stop_location.id}>
              {Array.isArray(item.bus_stop) && item.bus_stop.map((busStop, index) => (
                <tr key={item.id}>
                  {index === 0 && <td rowSpan={item.bus_stop.length}>{item.start_stop_location.location?.location_name}</td>}
                  <td>{busStop}</td>
                  <td>{item.landmark}</td>
                  {index === 0 && <td rowSpan={item.bus_stop.length}>{item.start_stop_location.arrival_time.slice(0, 5)}</td>}
                </tr>
              ))}
              {!Array.isArray(item.bus_stop) && (
                <tr>
                  <td style={{ maxWidth: "10vw", wordWrap: "break-word" }}>{item.start_stop_location.location?.location_name}</td>
                  <td style={{ maxWidth: "10vw", wordWrap: "break-word" }}>{item.bus_stop}</td>
                  <td style={{ maxWidth: "10vw", wordWrap: "break-word" }}>{item.landmark}</td>
                  <td style={{ maxWidth: "10vw", wordWrap: "break-word" }}>{item.arrival_time.slice(0, 5)}</td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </Modal.Body>
    );
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [fetchData, currentPage, updateFlag]);

  const renderCards = () =>
   !isLoading && data.length === 0 ? (
      <div
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "1.5rem",
          marginTop: "20px",
        }}
      >
        No data found
      </div>
    ) : (
      data.map((trip) => (
        <div
          key={trip.id}
          style={{ marginBottom: "2.5%", borderBlockColor: "black" }}
        >
          <Accordion defaultActiveKey="1">
            <Accordion.Item eventKey="1" data-testid="accordian-button">
              <Accordion.Header>
                <h4>
                  {trip.start_point_name}-{trip.end_point_name}
                </h4>
              </Accordion.Header>
              <Accordion.Body>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <div>
                    <p>Start Date : {trip.start_date}</p>
                    <p>Stop Date : {trip.end_date}</p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      marginLeft: "10%",
                      flexDirection: "column",
                    }}
                  >
                    <p>Bus : {trip.bus_name}</p>
                    <p>
                      Route : {trip.start_point_name}-{trip.end_point_name}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      marginLeft: "10%",
                      flexDirection: "column",
                    }}
                  >
                    <p style={{ maxWidth: "20vw", wordWrap: "break-word" }}>
                      Via :{trip.route.via}
                    </p>
                    <p>
                      Duration :{parseFloat(trip.route.duration).toFixed(2)}
                    </p>
                    <p>
                      Distance :{parseFloat(trip.route.distance).toFixed(2)}
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
                    data-testid="update-button"
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleted(trip)}
                    data-testid="delete-button"
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => passengers(trip.id)}
                    data-testid="update-button"
                  >
                    Passenger List
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleButtonClick(trip.route.id)}
                    data-testid="route-button"
                  >
                    Route Details
                  </button>
                </div>
                <p style={{ fontSize: "small", color: "coral" }}>
                  *The end date may have been or may have not been according to
                  the departure date offset set
                </p>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      ))
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
            console.error(
              "Error deleting trip:",
              error?.response?.data?.message
            );
            if (
              error?.response?.data?.message ===
              "Start date must be at least 2 days from the present date."
            ) {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error Deleting Trip, Start date should be atleast 2 days from present date.",
              });
            } else if (
              error?.response?.data?.message === "The trip has bookings"
            ) {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error Deleting Trip, The trip has bookings.",
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error Deleting Trip",
              });
            }
          });
      }
    });
  };

  return (
    <div>
      <Navbar className="bg-body-tertiary d-flex justify-content-between align-items-center">
      <div style={{display:"flex",flexDirection:"column",width:"100%"}}>
        <div
        style={{width:"100%",marginBottom:"1%"}}>
        <h1 style={{ textAlign: "center", flex: "1", margin: "0" }}>
          View All Trips
        </h1>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width:"100%"
          }}
        >
          <Link to={"/BusHome/add-trips"} style={{ marginLeft: "1%" }}>
            <button className="btn btn-primary"> + Add Trip</button>
          </Link>
          <Form style={{ textAlign: "center", width: "25%" }}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Bus/start/end location"
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
          <Dropdown style={{ marginLeft: "1%" }}>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              Order By
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setOrder(3)}>
                Most Recently Added
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setOrder(0)}>
                Least Recently Added
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setOrder(1)}>
                Trips in descending by date
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setOrder(2)}>
                Trips in ascending by date
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Link to={"/BusHome/add-recurring-trips"}>
            <button className="btn btn-primary"> + Add Recurring Trip</button>
          </Link>
        </div>
        </div>
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
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
  <Modal.Header closeButton>
    <Modal.Title>Route Detail</Modal.Title>
  </Modal.Header>
  <Modal.Body>
   {routeDetailsModal(modalData)}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowModal(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>
    </div>
  );
}
