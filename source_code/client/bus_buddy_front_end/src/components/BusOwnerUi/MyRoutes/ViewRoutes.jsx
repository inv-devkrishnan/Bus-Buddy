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
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { showLoadingAlert } from "../../common/loading_alert/LoadingAlert";


export default function Viewallroutes() {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState(3);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState("")
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async (page) => {
    showLoadingAlert("Fetching Routes");
    try {
      const response = await axiosApi.get(`bus-owner/view-routes/?page=${page}&search=${search}&ordering=${order}`);
       
      setData(response.data.results);
      setTotalPages(response.data.total_pages);
      setCurrentPage(response.data.current_page_number);
     
      setIsLoading(false)
      Swal.close();
    } catch (err) {
      Swal.close();
      setIsLoading(false)
      console.error("Error:", err);
    }
  }, [order, search]);

  const handleButtonClick = async (id) => {
    try {
      const response = await axiosApi.get(`bus-owner/pick-and-drop-stops/${id}/`);
      console.log(response)
      setModalData({...response.data})
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
  }, [fetchData, currentPage]);

  const handleSearchClick = () => {
    fetchData(currentPage);
  };

  const renderCards = () => (
    !isLoading && data.length === 0 ? (
      <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.5rem", marginTop: "20px" }}>
        No data found
      </div>
    ) : (
      data.map((viewroutes) => (
        <div key={viewroutes.id} style={{ marginBottom: "2.5%", borderBlockColor: "black" }}>
          <Accordion defaultActiveKey="1">
            <Accordion.Item eventKey="1" data-testid="accordian-button">
              <Accordion.Header>
                <h4>Route : {viewroutes.start_point_name} to {viewroutes.end_point_name}</h4>
              </Accordion.Header>
              <Accordion.Body>
                <div style={{ display: "flex",justifyContent:"space-between" }}>
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
                  <button className="btn btn-primary" data-testid="route-button" onClick={() => handleButtonClick(viewroutes.id)}>Route Details</button>

                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      ))
    )
  );
  


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
        Swal.close()
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Route Deleted successfully",
        });
        setData(data.filter(route => route.id !== id));
      
      })
      .catch((error) => {
        console.error("Error deleting route:", error?.response?.data);
        if (error?.response?.data === "route has Bookings") {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error Deleting Route,route has Bookings",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error Deleting Route",
          });
        }
      });
  };
  
  return (
    <div style={{ minHeight: "50vh", marginLeft: "1%" }}>
      <Navbar className="bg-body-tertiary d-flex justify-content-between align-items-center">
      <div style={{display:"flex",flexDirection:"column",width:"100%"}}> 
        <div>
        <h1 style={{ flex: "1", textAlign: "center" }}>View All Routes</h1>
        </div>
        <div style={{ display: "flex", justifyContent:"space-between"}}>
          <Dropdown style={{ width: "33%" }}>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              Order By
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setOrder(3)}> Most Recent </Dropdown.Item>
              <Dropdown.Item onClick={() => setOrder(0)}> Least Recent</Dropdown.Item>
              <Dropdown.Item onClick={() => setOrder(1)}> high to low trip Fare </Dropdown.Item>
              <Dropdown.Item onClick={() => setOrder(2)}> low to high trip Fare </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Form style={{ textAlign: "center", width: "25%" }}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Start/Stop Location"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn btn-primary" style={{ width: "29%" }} type="button" onClick={handleSearchClick}>
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </Form>
        <Form style={{ textAlign: "center", width: "33%", display: "flex", justifyContent: "flex-end" }}>
          <Link to={"/BusHome/Addroutes"}>
            <button className="btn btn-primary">+ Add Route</button>
          </Link>
        </Form>
      </div>
      </div>
      </Navbar>
      <div className="card-container">{renderCards()}</div>
      <div style={{ display: "flex", justifyContent: "center", margin: "20px", alignItems: "center", flexDirection: "column" }}>
        <CustomPaginator totalPages={totalPages} currentPage={currentPage} viewPage={fetchData} />
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
  <Modal.Header closeButton>
    <Modal.Title>Route Detail</Modal.Title>
  </Modal.Header>
  <Modal.Body>{routeDetailsModal(modalData)}<routeDetailsModal data={modalData} />
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" data-testid="close-button" onClick={() => setShowModal(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>

    </div>
  );
  
}
