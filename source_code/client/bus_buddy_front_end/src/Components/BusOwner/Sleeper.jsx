import { React, useState } from "react";

import { IconButton } from "@mui/material";
import Modal from "@mui/material/Modal";

import SleeperImage from "../../Assests/sleeper.png";
import FormComponent from "./FormComponent";

const style = {
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "cornflowerblue",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function Sleeper() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <IconButton onClick={handleOpen}>
        <img src={SleeperImage} alt="sleeper" />
      </IconButton>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={style}
      >
        <FormComponent />
      </Modal>
    </>
  );
}

export default Sleeper;