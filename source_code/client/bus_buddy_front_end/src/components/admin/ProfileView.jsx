import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import AdminProfileSplash from "../../assets/images/adminProfileView.png";

function ProfileView() {
  return (
    <Container>
      <h1>Admin Profile</h1>
      <div className="d-flex justify-content-between">
        <Card style={{ width: '25rem', height: '20%' }} className="p-3">
          <Card.Text>First Name :</Card.Text>
          <Card.Text>Last Name :</Card.Text>
          <Card.Text>Email :</Card.Text>
          <Card.Text>Phone :</Card.Text>
          <div className="d-flex">
          <Button className="me-2">Change Password</Button>
          <Button >Update Profile</Button>
          </div>
          
        </Card>
        <div>
          <img src={AdminProfileSplash} alt="admin_splash"></img>
        </div>
      </div>
    </Container>
  );
}
export default ProfileView;
