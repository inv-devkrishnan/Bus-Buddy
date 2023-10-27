import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import AdminProfileSplash from "../../assets/images/adminProfileView.png";

function ProfileView() {
  return (
    <Container>
      <h1>Admin Profile</h1>
      <div className="d-flex spac">
        <Card style={{ width: '25rem' }}>
          <Card.Text>First Name :</Card.Text>
          <Card.Text>Last Name :</Card.Text>
          <Card.Text>Email :</Card.Text>
          <Card.Text>Phone :</Card.Text>
          <Button>Update Profile</Button>
        </Card>
        <div>
          <img src={AdminProfileSplash} alt="admin_splash"></img>
        </div>
      </div>
    </Container>
  );
}
export default ProfileView;
