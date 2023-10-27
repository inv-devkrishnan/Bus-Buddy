import React from "react";
import {Link} from "react-router-dom";
import Card from "react-bootstrap/Card";
import UserSideBar from "../../utils/hooks/UserSideBar";

export default function Home() {
  return (
    <>
      <div style={{ display: "flex"}}>
        <UserSideBar />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center",justifyContent:"space-between"}}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "12%",
          }}
        >
          <Card
            style={{
              width: "18rem",
              borderRadius: "18px",
              backgroundColor: "grey",
              marginRight:"5%",
              marginLeft:"15%",
            }}
          >
            <Card.Body style={{ textAlign: "center" }}>
              <Card.Title>Create Bus</Card.Title>
              <Card.Text>Create new task and add them to todolist</Card.Text>
              <Link to={"/Addbus"}>
                <button className="btn btn-primary">Add Bus</button>
              </Link>
            </Card.Body>
          </Card>
          <Card
            style={{
              width: "18rem",
              borderRadius: "18px",
              backgroundColor: "grey",
            }}
          >
            <Card.Body style={{ textAlign: "center" }}>
              <Card.Title>Delete Bus</Card.Title>
              <Card.Text>
                Delete task from todolist according to the taskid
              </Card.Text>
              <Link to={"/Deletebus"}>
                <button className="btn btn-primary">Delete Bus</button>
              </Link>
            </Card.Body>
          </Card>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "12%",
          }}
        >
          <Card
            style={{
              width: "18rem",
              borderRadius: "18px",
              backgroundColor: "grey",
              // marginRight:"5%",
              // marginLeft:"15%",
            }}
          >
            <Card.Body style={{ textAlign: "center" }}>
              <Card.Title>Viewall Bus</Card.Title>
              <Card.Text>View all the tasks in the todolist in table</Card.Text>
              <Link to={"/Viewbus"}>
                <button className="btn btn-primary">Viewall Bus</button>
              </Link>
            </Card.Body>
          </Card>
          <Card
            style={{
              width: "18rem",
              borderRadius: "18px",
              backgroundColor: "grey",
            }}
          >
            <Card.Body style={{ textAlign: "center" }}>
              <Card.Title>Update Bus</Card.Title>
              <Card.Text>
                Update the task name of an existing task in the todolist
              </Card.Text>
              <Link to={"/Updatebus"}>
                <button className="btn btn-primary">Update Bus</button>
              </Link>
            </Card.Body>
          </Card>
        </div>
      </div>
      </div>
    </>
  );
}
