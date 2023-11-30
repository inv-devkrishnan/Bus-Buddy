import React, { useContext, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Grid } from "@mui/material";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import UserLayer from "../User/UserLayer";
import driver from "../../assets/driver.png";
import { openAxiosApi } from "../../utils/axiosApi";
import { SeatContext } from "../../utils/SeatContext";

export default function UserLayout(props) {
  const { updateSeatData } = useContext(SeatContext); // use context for updating seat data

  useEffect(() => {
    getSeatData();
  }, []);

  const getSeatData = async () => {
    await openAxiosApi
      .get(
        `user/view-seats/?trip_id=${props?.trip}&&start_location=${props?.startLocation}&&end_location=${props?.endLocation}
      `
      )
      .then((res) => {
        updateSeatData(res.data);
      })
      .catch((err) => {
        console.log("error:" + err.response.data);
      });
  };

  return (
    <div className="d-flex flex-column">
      <Grid item m={2}>
        <span style={{ color: "cornflowerblue" }}>Lower Deck</span>
        <Card
          sx={{
            border: 1,
            width: 300, // Default width for larger viewports
          }}
        >
          <CardContent>
            <Grid container>
              <Grid item xs={9}></Grid>
              <Grid item xs={3}>
                <img src={driver} alt="driver" />
              </Grid>
            </Grid>

            <UserLayer row={1} />
            <UserLayer row={2} />
            <UserLayer row={3} />
            <UserLayer row={4} />
            <UserLayer row={5} />
          </CardContent>
        </Card>
      </Grid>
      <Grid item m={2}>
        <span style={{ color: "cornflowerblue" }}>Upper Deck</span>
        <Card sx={{ width: 300, border: 1 }}>
          <CardContent>
            <Grid container>
              <Grid item xs={9}></Grid>
              <Grid item xs={3}>
                <HorizontalRuleIcon sx={{ color: "white" }} />{" "}
              </Grid>
            </Grid>
            <UserLayer row={6} />
            <UserLayer row={7} />
            <UserLayer row={8} />
            <UserLayer row={9} />
            <UserLayer row={10} />
          </CardContent>
        </Card>
      </Grid>
    </div>
  );
}
