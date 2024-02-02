import React, { useEffect, useState,useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Accordion from "react-bootstrap/Accordion";
import { axiosApi } from "../../../utils/axiosApi";
import Swal from "sweetalert2";
import CustomPaginator from "../../common/paginator/CustomPaginator";



export default function Viewallbus() {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage,setCurrentPage] = useState(1);
  const [updateFlag, setUpdateFlag] = useState(false)

  const navi = useNavigate();

  const fetchData = useCallback(async (page) => {
    try{
      const response = await axiosApi.get(
        `bus-owner/view-trip/?page=${page}`
      );
      setData(response.data.results);
      console.log(response.data.results);
      setTotalPages(response.data.total_pages);
      setCurrentPage(response.data.current_page_number);
    }catch(err) {
      console.error("Error:", err);}
   
  },[]);

  useEffect(() => {
    
    fetchData(currentPage);
  }, [fetchData,currentPage,updateFlag]);
  console.log(data);

  

  

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
                <button
                  className="btn btn-primary"
                  onClick={() => passengers(trip.id)}
                  data-testid = "update-button"
                >
                  Passenger List
                </button>
              </div>
              <p style={{fontSize : "small", color: "coral"}}>*The end date may have been or may have not been according to the departure date offset set</p>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    ));
  };


  const passengers = (id) => {
    navi("/passengers-list", { state: `${id}` });
  };
  const update = (id) => {
    navi("/update-trips", { state: `${id}` });
  };
  const deleted = (trip) => {
    console.log(trip)
    
    axiosApi
      .put(`bus-owner/delete-trip/${trip.id}/`)
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
        <CustomPaginator
          totalPages={totalPages}
          currentPage={currentPage}
          viewPage={fetchData}
        />
      </div>
    </div>
  );
}
