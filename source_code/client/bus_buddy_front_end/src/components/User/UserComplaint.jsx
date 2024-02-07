import React, { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import ComplaintForm from "./ComplaintForm";
import ComplaintResponse from "./ComplaintResponse";
import { axiosApi } from "../../utils/axiosApi";

export default function UserComplaint() {
  const [complaintData, setComplaintData] = useState([]);

  const handleTabSelect = (key) => {
    if (key === "response") {
      axiosApi
        .get("user/list-complaints/", {
          params: {
            ordering: "",
            search: "",
          },
        })
        .then((res) => {
          setComplaintData(res.data);
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  };

  return (
    <div className="d-flex flex-column p-2 bd-highlight">
      <div className="mb-auto p-2 bd-highlight m-2">
        <h1>Register a Complaint</h1>
        <p className="lead">Let us know how we can improve your experience</p>
      </div>
      <Tabs
        defaultActiveKey="form"
        id="uncontrolled-tab"
        onSelect={handleTabSelect}
        className="m-3"
      >
        <Tab eventKey="form" title="Complaint Form">
          <ComplaintForm />
        </Tab>
        <Tab eventKey="response" title="View Response">
          <ComplaintResponse
            complaintData={complaintData}
            setComplaintData={setComplaintData}
          />
        </Tab>
      </Tabs>
    </div>
  );
}
