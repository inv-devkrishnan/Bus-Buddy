import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SeatContext } from "../../utils/SeatContext";
import { Card, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Modal, Button } from "react-bootstrap";
import SeatLegend from "./SeatLegend";

export default function SeatDetailCard(props) {
  const { seatList } = useContext(SeatContext); // context that stores list of seats
  const [totalCost, setTotalCost] = useState(0); // to display total cost
  const [loginModal, setLoginModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (seatList.length > 0) {
      let sumOfCost = 0;
      seatList.forEach((element) => {
        sumOfCost = Number(element.seat_cost) + sumOfCost; // adds the cost of all seats
      });
      const routeCost = Number(props?.routeCost);
      const gst = Number(props?.gst) === 0 ? 1 : Number(props?.gst);
      const result =
        sumOfCost + routeCost + ((sumOfCost + routeCost) * gst) / 100;
      const roundedResult = result.toFixed(2);
      setTotalCost(parseFloat(roundedResult));
    } else {
      setTotalCost(0);
    }
  }, [seatList, props?.routeCost, props?.gst]);

  const loginPage = () => {
    navigate("/login");
  };

  const handleclose = () => {
    setLoginModal(false);
    localStorage.removeItem("pick_up");
    localStorage.removeItem("drop_off");
    localStorage.removeItem("pick_stop");
    localStorage.removeItem("drop_stop");
    localStorage.removeItem("total_amount");
    localStorage.removeItem("seat_list");
  };

  const handleSubmit = () => {
    localStorage.setItem("pick_up", props.selectionModelPick);
    localStorage.setItem("pick_stop", props.selectedPickStop);
    localStorage.setItem("drop_off", props.selectionModelDrop);
    localStorage.setItem("drop_stop", props.selectedDropStop);
    localStorage.setItem("total_amount", totalCost);
    let seat = JSON.stringify(seatList);
    localStorage.setItem("seat_list", seat);
    if (localStorage.getItem("refresh_token")) {
      setLoginModal(false);
      navigate("/traveller-data");
    } else {
      setLoginModal(true);
    }
  };

  return (
    <>
      <Card className="m-2 p-3" sx={{ width: "68%", boxShadow: 5 }}>
        <div className="d-flex flex-column">
          <div>
            <Typography id="modal-modal-title" variant="h5" component="h2">
              Seat Details
            </Typography>

            <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
              <Table
                responsive="md"
                stickyHeader
                sx={{ minWidth: "100%" }}
                aria-label="simple table"
              >
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
                        {seat.seat_type === 0 ? "Seater" : "Sleeper"}
                      </TableCell>
                      <TableCell align="center">{seat.seat_cost}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography align="right" m={1} variant="subtitle1">
              Travel fare : ₹ {props?.routeCost}
              <br />
              GST : {props?.gst}%
              <br />
              ________________
              <br />
              Total Cost : ₹ {totalCost}
            </Typography>
            <Button
              type="submit"
              variant="primary"
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

      <Modal show={loginModal} onHide={handleclose}>
        <Modal.Header>
          <Modal.Title style={{ margin: 5, padding: 5 }}>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ margin: 5, padding: 5 }}>
          You have to login as user to continue the booking.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={loginPage}>
            Login
          </Button>
          <Button variant="secondary" onClick={handleclose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
