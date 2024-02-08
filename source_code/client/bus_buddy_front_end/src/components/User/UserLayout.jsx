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
    openAxiosApi
      .get(
        `user/view-seats/?trip_id=${props?.trip}&&start_location=${props?.startLocation}&&end_location=${props?.endLocation}
        `
      )
      .then((res) => {
        updateSeatData(res.data);
      })
      .catch((err) => {
        console.log("error:" + err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.trip, props.startLocation, props.endLocation]);

  return (
    <div className="d-flex flex-column">
      <Grid item m={1}>
        <span style={{ color: "cornflowerblue" }}>Lower Deck</span>
        <Card
          sx={{
            border: 1,
            width: 250,
          }}
        >
          <CardContent>
            <Grid container>
              <Grid item xs={9}></Grid>
              <Grid item xs={3}>
                <img src={driver} draggable={false} alt="driver" />
              </Grid>
            </Grid>
            <br />
            <UserLayer row={1} />
            <UserLayer row={2} />
            <UserLayer row={3} />
            <UserLayer row={4} />
            <UserLayer row={5} />
          </CardContent>
        </Card>
      </Grid>
      <Grid item m={1}>
        <span style={{ color: "cornflowerblue" }}>Upper Deck</span>
        <Card
          sx={{
            width: 250,
            border: 1,
          }}
        >
          <CardContent>
            <Grid container>
              <Grid item xs={9}></Grid>
              <Grid item xs={3}>
                <HorizontalRuleIcon sx={{ color: "white" }} />{" "}
              </Grid>
            </Grid>
            <br />
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
