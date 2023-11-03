import { Card, Typography } from "@mui/material";

import Sleeper from "../../assets/images/sleeper.png";
import FemaleSleeper from "../../assets/images/femaleSleeper.png";
import MaleSleeper from "../../assets/images/maleSleeper.png";

function SeatLegend() {
  // component which shows the different seat symbols and their meaning
  return (
    <Card variant="outlined" sx={{width: "20rem",height:"17.5rem", margin: 3, padding: 2, boxShadow: 5 }}>
      <Typography id="modal-modal-subtitle" variant="h6" component="h5">
        Seat Legend
      </Typography>
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src={Sleeper} alt="sleeper"></img>
        <p>Available Sleeper</p>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src={MaleSleeper} alt="sleeper"></img>
        <p>Sleeper Booked by Male</p>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src={FemaleSleeper} alt="sleeper"></img>
        <p>Sleeper Booked by Female</p>
      </div>
    </Card>
  );
}
export default SeatLegend;
