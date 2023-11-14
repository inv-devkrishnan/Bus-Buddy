import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SeatContext } from "../../utils/SeatContext";
import { Button, Card, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import SeatLegend from "./SeatLegend";

export default function SeatDetailCard(props) {
  const { seatList, tripID } = useContext(SeatContext); // context that stores list of seats
  const [totalCost, setTotalCost] = useState(0); // to display total cost
  const NUMBER_OF_ROWS = 3; // number of rows in seat details table
  const [page, setPage] = useState(0); // to set current page
  const [rowsPerPage, setRowsPerPage] = useState(NUMBER_OF_ROWS); // to set number of rows in a page
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("pick_up");
    localStorage.removeItem("drop_off");
    localStorage.removeItem("total_amount");
    localStorage.removeItem("seat_list");
  });

  useEffect(() => {
    if (seatList.length > 0) {
      let sumOfCost = 0;
      seatList.forEach((element) => {
        sumOfCost = Number(element.seat_cost) + sumOfCost; // adds the cost of all seats
      });
      setTotalCost(sumOfCost);
    } else {
      setTotalCost(0);
    }
  }, [seatList]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleSubmit = () => {
    localStorage.setItem("pick_up", props.selectionModelPick);
    localStorage.setItem("drop_off", props.selectionModelDrop);
    localStorage.setItem("total_amount", totalCost);
    let seat = JSON.stringify(seatList);
    localStorage.setItem("seat_list", seat);
    navigate("/traveller-data");
  };

  return (
    <Card sx={{ width: "90%", margin: 4, padding: 2, boxShadow: 5 }}>
      <div style={{ display: "flex" }}>
        <div style={{ width: "55%" }}>
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
                {(rowsPerPage > 0
                  ? seatList.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : seatList
                ).map((seat) => (
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
            <TablePagination
              rowsPerPageOptions={[NUMBER_OF_ROWS]}
              component="div"
              count={seatList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>

          <Typography align="right" m={1} variant="subtitle1">
            Total Cost : ₹ {totalCost}
          </Typography>
          <Button
            type="submit"
            variant="contained"
            disabled={
              !(
                seatList.length &&
                props.selectionModelPick.length &&
                props.selectionModelDrop.length
              )
            }
            onClick={handleSubmit}
          >
            Enter traveller details
          </Button>
        </div>

        <SeatLegend />
      </div>
    </Card>
  );
}
