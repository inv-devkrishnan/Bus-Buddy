import { Card, Typography } from "@mui/material";

import Sleeper from "../../assets/sleeper.png";
import FemaleSleeper from "../../assets/femaleSleeper.png";
import MaleSleeper from "../../assets/maleSleeper.png";

import "./SeatLegend.css";

function SeatLegend() {
  // component which shows the different seat symbols and their meaning
  return (
    <Card variant="outlined" className="card">
      <Typography
        id="modal-modal-subtitle"
        variant="h6"
        component="h5"
        className="m-1"
      >
        Seat Legend
      </Typography>
      <div className="d-flex align-items-center flex-sm-row  flex-md-row">
        <img src={Sleeper} alt="sleeper" draggable="false"></img>
        <p className="m-1">Available</p>
      </div>
      <div className="d-flex align-items-center flex-sm-row flex-md-row">
        <img src={MaleSleeper} alt="sleeper" draggable="false"></img>
        <p className="m-1">Booked by Male</p>
      </div>
      <div className="d-flex align-items-center flex-sm-row flex-md-row">
        <img src={FemaleSleeper} alt="sleeper" draggable="false"></img>
        <p className="m-1">Booked by Female</p>
      </div>
    </Card>
  );
}
export default SeatLegend;
