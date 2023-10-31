import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./table.css";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Viewalltask() {
  const [pageno, setpageno] = useState(1);
  const [data, setData] = useState([]);
  const navi = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `http://localhost:8000/bus-owner/View-Bus/${pageno}/`
      );
      setData(response.data);
    };
    fetchData();
  }, [pageno]);

  const next = (event) => {
    event.preventDefault();
    setpageno(pageno + 1);
  };

  const prev = (event) => {
    event.preventDefault();
    pageno > 1 && setpageno(pageno - 1);
  };

  const renderCards = () => {
    return data.map((viewbus) => (
      <div className="card" style={{ marginBottom: "1.5%" }} key={viewbus.id}>
        <h2>Bus Name: {viewbus.bus_name}</h2>
        <div style={{ display: "flex" }}>
          <div>
            <p>Bus ID: {viewbus.id}</p>
            <p>Plate No: {viewbus.plate_no}</p>
          </div>
          <div style={{ marginLeft: "10%" }}>
            {viewbus.bus_type === 0 ? (
              <p>Bus Type: Low Floor</p>
            ) : viewbus.bus_type === 1 ? (
              <p>Bus Type: Multi Axle</p>
            ) : (
              <p>Bus Type: Multi Axle Low Floor</p>
            )}

{viewbus.bus_ac === 0 ? (
    <p>Bus A/C: A/C</p>
  ) : viewbus.bus_ac === 1 ? (
    <p>Bus A/C: Non A/C</p>
  ) : (
    <p>Bus A/C: Unknown</p>
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
            onClick={() => deleted(viewbus.id)}
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };
  const update = (id) => {
    navi("/UpdateBus", { state: `${id}` });
  };
  const deleted = (id) => {
    navi("/DeleteBus", { state: `${id}` });
  };

  return (
    <div>
      <Navbar className="bg-body-tertiary justify-content-between">
        <Form style={{ textAlign: "center", marginLeft: "25%" }} inline>
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
          justifyContent: "space-between",
          margin: "20px",
        }}
      >
        <button className="btn btn-primary" onClick={prev}>
          prev
        </button>
        <Link to={"/AddBus"}>
          <button className="btn btn-primary"> + Add Bus</button>
        </Link>
        <button className="btn btn-primary" onClick={next}>
          next
        </button>
      </div>
    </div>
  );
}
