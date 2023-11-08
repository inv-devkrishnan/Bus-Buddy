import { Card, Typography } from "@mui/material";

import Sleeper from "../../../assets/sleeper.png";
import AddedSleeper from "../../../assets/maleSleeper.png";


function SeatDescription() {
  // component which shows the different seat symbols and their meaning
  return (
    <Card
      variant="outlined"
      className="card"
      sx={{ width: "15rem", margin: 1,padding:2, boxShadow: 4 }}
    >
      <Typography id="modal-modal-subtitle" variant="h6" component="h5">
        Seat Details
      </Typography>
      <div className="d-flex align-items-center">
        <img src={Sleeper} alt="sleeper"></img>
        <p>Pending</p>
      </div>
      <div className="d-flex align-items-center ">
        <img src={AddedSleeper} alt="sleeper"></img>
        <p>Added</p>
      </div>
    </Card>
  );
}
export default SeatDescription;
