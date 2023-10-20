import React from "react";

import { Box, Button, Grid, Card, Typography } from "@mui/material";

export default function SeatDetailCard() {
  return (
    <div>
      <Card
        sx={{ width: "20rem", margin: 5,padding: 2,boxShadow:5}}
      >
        <Box>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Seat Number
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Seat Details
          </Typography>
          <Button type="submit">Submit</Button>
        </Box>
      </Card>
    </div>
  );
}
