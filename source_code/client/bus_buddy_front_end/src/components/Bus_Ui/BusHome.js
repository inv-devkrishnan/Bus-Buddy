import React from 'react'
import { BrowserRouter as Router, Route, Switch,Link, Routes } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';


export default function Home() {
  
  return (
    <>
      <div style={{display:"flex",justifyContent:"space-between",margin:"3%"}}>
      <Card style={{ width: '18rem',borderRadius:'18px',backgroundColor:"grey"  }}>
          <Card.Body style={{textAlign:"center"}}>
            <Card.Title>Create Bus</Card.Title>
              <Card.Text>
                Create new task and add them to todolist
              </Card.Text>
              <Link to={'/Addbus'}>
                  <button className="btn btn-primary">Add Bus</button> 
              </Link>      
          </Card.Body>
       </Card>
        
       <Card style={{ width: '18rem',borderRadius:'18px',backgroundColor:"grey" }}>
          <Card.Body style={{textAlign:"center"}}>
            <Card.Title>Delete Bus</Card.Title>
              <Card.Text>
                Delete task from todolist according to the taskid
              </Card.Text>
              <Link to={'/Deletebus'}>
                <button className="btn btn-primary">Delete Bus</button> 
              </Link>     
          </Card.Body>
       </Card>
        
       <Card style={{ width: '18rem',borderRadius:'18px', backgroundColor:"grey"}}>
          <Card.Body style={{textAlign:"center"}}>
            <Card.Title>Update Bus</Card.Title>
              <Card.Text>
                Update the task name of an existing task in the todolist
              </Card.Text>
              <Link to={'/Updatebus'}>
                <button className="btn btn-primary">Update Bus</button> 
              </Link>    
          </Card.Body>
       </Card>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",margin:"3%"}}>
        
       <Card style={{ width: '18rem',borderRadius:'18px',backgroundColor:"grey" }}>
          <Card.Body style={{textAlign:"center"}}>
            <Card.Title>Viewall Bus</Card.Title>
              <Card.Text>
                View all the tasks in the todolist in table 
              </Card.Text>
              <Link to={'/Viewbus'}>
                <button className="btn btn-primary">Viewall Bus</button> 
              </Link>  
          </Card.Body>
       </Card>
      </div>
    </>
  )
}
