import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";
import { axiosApi } from "../../../utils/axiosApi";
import Swal from "sweetalert2";
import CustomPaginator from "../../common/paginator/CustomPaginator";

export default function Viewallbus() {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletedBusFlag, setDeletedBusFlag] = useState(false);

  const navi = useNavigate();

  const addAmenities = (id) => {
    navi("/Addamenities", { state: `${id}` });
  };

  const updateAmenities = (id) => {
    navi("/Updateamenities", { state: `${id}` });
  };

  const update = (id) => {
    navi("/UpdateBus", { state: `${id}` });
  };

  const addSeatDetails = (id, bus_seat_type) => {
    navi("/full-sleeper-details", {
      state: { id: `${id}`, bus_seat_type: bus_seat_type },
    });
  };

  const deleted = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this bus!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        axiosApi
          .put(`bus-owner/delete-bus/${id}/`)
          .then((response) => {
            console.log("Bus deleted successfully");
            Swal.fire({
              icon: "success",
              title: "Deleted",
              text: "Bus Deleted successfully",
            });
            setDeletedBusFlag((prevFlag) => !prevFlag);
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
      }
    });
  };

  const fetchData = useCallback(async (page) => {
    try {
      const response = await axiosApi.get(`bus-owner/view-bus/?page=${page}`);
      setData(response.data.results);
      console.log(response.data.results);
      setTotalPages(response.data.total_pages);
      setCurrentPage(response.data.current_page_number);
    } catch (err) {
      console.error("Error:", err);
    }
  }, []);

  useEffect(() => {
    fetchData(currentPage);
  }, [fetchData, currentPage, deletedBusFlag]);

  // Function to get the bus type label
  const getBusTypeLabel = (busType) => {
    if (busType === 0) {
      return "Low Floor";
    } else if (busType === 1) {
      return "Multi Axle";
    } else {
      return "Multi Axle Low Floor";
    }
  };

  // Function to get the bus A/C label
  const getBusACLabel = (busAC) => {
    if (busAC === 0) {
      return "A/C";
    } else if (busAC === 1) {
      return "Non A/C";
    } else {
      return "Unknown";
    }
  };

  const getBusSeatLabel = (busSeat) => {
    if (busSeat === 0) {
      return "Sleeper";
    } else if (busSeat === 1) {
      return "Seater";
    } else if (busSeat === 2) {
      return "Both";
    } else {
      return "Unknown";
    }
  };

  const renderCards = () => {
    return data.map((viewbus) => (
      <div key={viewbus.id} style={{ marginBottom: "2.5%", borderBlockColor: "black" }}>
        <Accordion defaultActiveKey="1">
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <h4 style={{ maxWidth: "100%", wordWrap: "break-word" }}>Name : {viewbus.bus_name}</h4>
            </Accordion.Header>
            <Accordion.Body>
              <div style={{ display: "flex" }}>
                <div>
                  <p>Plate No : {viewbus.plate_no}</p>
                  <p>Bus A/c : {getBusACLabel(viewbus.bus_ac)}</p>
                </div>
                <div style={{ marginLeft: "10%" }}>
                  <p>Bus Type: {getBusTypeLabel(viewbus.bus_type)}</p>
                  <p>Bus Seat Type: {getBusSeatLabel(viewbus.bus_seat_type)} </p>
                </div>
              </div>
              <div style={{ marginBottom: "1%", display: "flex", justifyContent: "space-evenly" }}>
                <button className="btn btn-primary" onClick={() => update(viewbus.id)} data-testid="update-button">
                  Update
                </button>
                <button className="btn btn-primary" onClick={() => addSeatDetails(viewbus.id, viewbus.bus_seat_type)} data-testid="add-seat-button">
                  Seat Details
                </button>
                <button className="btn btn-danger" onClick={() => deleted(viewbus.id)} data-testid="delete-button">
                  Delete
                </button>
              </div>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="0" onClick={() => viewbus.id} data-testid="accordian-button">
            <Accordion.Header style={{ maxWidth: "100%", wordWrap: "break-word" }}>Amenities of {viewbus.bus_name}</Accordion.Header>
            <Accordion.Body>
              {viewbus.amenities_data && viewbus.amenities_data.length > 0 ? (
                <>
                  <p>Do you want to update the existing amenities?</p>
                  <button className="btn btn-primary" onClick={() => updateAmenities(viewbus.id)} data-testid="update-amenities-button">
                    Update amenities
                  </button>
                </>
              ) : (
                <>
                  <p>There are no Amenities added for this bus. Please add amenities for your bus.</p>
                  <button className="btn btn-primary" onClick={() => addAmenities(viewbus.id)} data-testid="add-amenities-button">
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

  return (
    <div>
      <Navbar className="bg-body-tertiary d-flex justify-content-between align-items-center">
        <h1 className="mx-auto">View All Bus</h1>
        <Form style={{ textAlign: "center" }}>
          <Link to={"/AddBus"}>
            <button className="btn btn-primary" style={{ marginRight: "10px" }}>+ Add Bus</button>
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
