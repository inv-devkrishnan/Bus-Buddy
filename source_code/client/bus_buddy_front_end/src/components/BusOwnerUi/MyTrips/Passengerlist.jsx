import React, { useEffect, useState, useCallback } from "react";
import {  useLocation } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import { axiosApi } from "../../../utils/axiosApi";
import CustomPaginator from "../../common/paginator/CustomPaginator";
import "./Passengerlist.css"

export default function PassengerList() {
  const location = useLocation();
  const trip = location.state;
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = useCallback(async (page) => {
    try {
      const response = await axiosApi.get(`bus-owner/passenger-list/${trip}/`);
      setData(response.data.results.data);
      setTotalPages(response.data.total_pages);
      setCurrentPage(response.data.current_page_number);
    } catch (err) {
      console.error("Error:", err);
    }
  }, [trip]);

  useEffect(() => {
    fetchData(currentPage);
  }, [fetchData, currentPage]);
  console.log(data);

  const renderTable = () => {
    if (!data || data.length === 0) {
      return (
        <tr>
          <td colSpan="5">No data available</td>
        </tr>
      );
    }

    return data.map((passenger, index) => {
      const gender = passenger.traveller_gender === 1 ? "Male" : "Female";

      return (
        <tr key={passenger.id}>
          <td>{index + 1}</td>
          <td>{passenger.traveller_name}</td>
          <td>{passenger.seat_number}</td>
          <td>{gender}</td>
        </tr>
      );
    });
  };

  return (
    <div>
      <Navbar className="bg-body-tertiary d-flex justify-content-between align-items-center">
        <h1 className="mx-auto">Passenger List</h1>
      </Navbar>
      <div className="table-container">
        <table className="passenger-table">
          <thead>
            <tr>
              <th>Si Number</th>
              <th>Traveller Name</th>
              <th>Seat Number</th>
              <th>Gender</th>
            </tr>
          </thead>
          <tbody>{renderTable()}</tbody>
        </table>
      </div>
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
