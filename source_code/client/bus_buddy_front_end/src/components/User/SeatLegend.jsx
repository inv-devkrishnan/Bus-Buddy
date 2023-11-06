import { Card, Typography } from "@mui/material";

import Sleeper from "../../assets/images/sleeper.png";
import FemaleSleeper from "../../assets/images/femaleSleeper.png";
import MaleSleeper from "../../assets/images/maleSleeper.png";

function SeatLegend() {
  // component which shows the different seat symbols and their meaning
  return (
    <Card variant="outlined" sx={{width: "45%",height:"50%", margin: 1, padding: 2, border:1 }}>
      <Typography id="modal-modal-subtitle" variant="h6" component="h5">
        Seat Legend
      </Typography>
      <div className="d-flex align-items-center flex-sm-row  flex-md-row">
        <img src={Sleeper} alt="sleeper"></img>
        <p>Available Sleeper</p>
      </div>
      <div className="d-flex align-items-center flex-sm-row flex-md-row" >
        <img src={MaleSleeper} alt="sleeper"></img>
        <p>Sleeper Booked by Male</p>
      </div>
      <div className="d-flex align-items-center flex-sm-row flex-md-row" >
        <img src={FemaleSleeper} alt="sleeper"></img>
        <p>Sleeper Booked by Female</p>
      </div>
    </Card>
  );
}
export default SeatLegend;
