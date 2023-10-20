import React from 'react'

import { Box,Button,Grid,Card,Typography } from "@mui/material";

export default function SeatDetailCard() {
  return (
    <div>
      <Card>
        <Box>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Seat Number
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Seat Details
          </Typography>
        </Box>
      </Card>
</div>
  )
}
