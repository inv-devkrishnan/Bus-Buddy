import { React, useState } from "react";

import { IconButton,Button,Grid } from "@mui/material";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Sleeper from "../../Assests/sleeper.png";
import Booked from "../../Assests/bookedSleeper.png";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function UserSleeper() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [booked, setBooked] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setBooked(true);
  };

  const handleCancel = (event) => {
    event.preventDefault();
    setBooked(false);
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        {booked ? (
          <img src={Booked} alt="sleeper" />
        ) : (
          <img src={Sleeper} alt="booked" />
        )}
      </IconButton>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Seat Number
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Seat Details
          </Typography>
          <Grid container>
            <Grid item xs={10}></Grid>
            <Grid item xs={2}>
              {booked ? (
                <Button onClick={handleCancel}>Cancel</Button>
              ) : (
                <Button onClick={handleSubmit}>Book</Button>
              )}
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
}

export default UserSleeper;
