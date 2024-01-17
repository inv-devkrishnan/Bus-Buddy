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
  const addSeatDetails = (id) => {
    navi("/full-sleeper-details", {
      state: `${id}`,
    });
  };
  const deleted = (id) => {
    axiosApi
      .put(`bus-owner/delete-bus/${id}/`)
      .then((response) => {
        console.log("bus deleted successfuly");
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
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosApi.get(
        `bus-owner/view-bus/?page=${page}`
      );
      setData(response.data.results);
      console.log(response.data.results);
      setNext(response.data.has_next);
      setPrevious(response.data.has_previous);
      setTotalPages(response.data.total_pages);
    };
    fetchData();
  }, [page,deletedBusFlag]);
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

  const renderCards = () => {
    return data.map((viewbus) => (
      <div
        key={viewbus.id}
        style={{ marginBottom: "2.5%", borderBlockColor: "black" }}
      >
        <Accordion defaultActiveKey="1">
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <h4>Name : {viewbus.bus_name}</h4>
            </Accordion.Header>
            <Accordion.Body>
              <div style={{ display: "flex" }}>
                <div>
                  <p>Plate No : {viewbus.plate_no}</p>
                  <p>Bus A/c : {getBusACLabel(viewbus.bus_ac)}</p>
                </div>
                <div style={{ marginLeft: "10%" }}>
                  <p>Bus Type: {getBusTypeLabel(viewbus.bus_type)}</p>
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
                  data-testid = "update-button"
                >
                  Update
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => addSeatDetails(viewbus.id)}
                  data-testid = "add-seat-button"
                >
                  Seat Details
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => deleted(viewbus.id)}
                  data-testid = "delete-button"
                >
                  Delete
                </button>
              </div>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="0" onClick={() => viewbus.id} data-testid = "accordian-button">
            <Accordion.Header>Amenities of {viewbus.bus_name}</Accordion.Header>
            <Accordion.Body>
              {viewbus.amenities_data && viewbus.amenities_data.length > 0 ? (
                <>
                  <p>Do you want to update the existing amenities?</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => updateAmenities(viewbus.id)}
                    data-testid = "update-amenities-button"
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
                    data-testid = "add-amenities-button"
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

  

  return (
    <div>
      <Navbar className="bg-body-tertiary d-flex justify-content-between align-items-center">
      <h1 className="mx-auto">Viewall</h1>
      <Form style={{ textAlign: "center" }}>
        <Link to={"/AddBus"}>
          <button className="btn btn-primary"> + Add Bus</button>
        </Link>
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
