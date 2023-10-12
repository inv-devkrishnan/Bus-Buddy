import React from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';


export default function BusHome() {
  return (
    <div>
        <Navbar className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">Navbar with text</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <a href="#login">Mark Otto</a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
        <div style={{
            display:"flex",
            flexDirection:"row",
            width:"50%"
        }}>
        <hi>Hello World</hi> 
         <img style={{width:'100%',borderRadius:'0px'}} src="https://png.pngtree.com/png-vector/20190223/ourmid/pngtree-vector-house-icon-png-image_695369.jpg" alt='Home'></img>
        </div> 
    </div>
  )
}
