import { Button, Card, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { SeatContext } from "../../utils/SeatContext";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function SeatDetailCard(props) {
  const { seatList } = useContext(SeatContext);
  const [totalCost, setTotalCost] = useState(0);
  useEffect(() => {
    console.log(seatList)
    if (seatList.length > 0) {
      let sumOfCost = 0;
      seatList.forEach((element) => {
        sumOfCost = element.seat_cost + sumOfCost;
      });
      setTotalCost(sumOfCost);
    } else {
      setTotalCost(0);
    }
  }, [seatList]);

  return (
    <div>
      <Card sx={{ width: "20rem", margin: 5, padding: 2, boxShadow: 5 }}>
        <Typography id="modal-modal-title" variant="h5" component="h2">
          Seat Details
        </Typography>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 200 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Seat Number</TableCell>
                <TableCell align="right">Seat Type</TableCell>
                <TableCell align="right">Price (₹)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {seatList.map((seat) => (
                <TableRow
                  key={seat.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{seat.seat_number}</TableCell>
                  <TableCell align="center">
                    {seat.seat_type ? "Seater" : "Sleeper"}
                  </TableCell>
                  <TableCell align="center">{seat.seat_cost}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography align="right" margin={1} variant="subtitle1">
          Total Cost : ₹ {totalCost}
        </Typography>
        <Button type="submit" variant="contained" disabled={!seatList.length}>
          Book Tickets
        </Button>
      </Card>
    </div>
  );
}
