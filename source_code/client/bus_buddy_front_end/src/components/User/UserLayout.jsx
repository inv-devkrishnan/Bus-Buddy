import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Grid } from "@mui/material";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import UserLayer from "../User/UserLayer";
import driver from "../../assets/images/driver.png";
import { axiosApi } from "../../utils/axiosApi";

export default function UserLayout() {
  const [seatDetails, setSeatDetails] = useState([]);
  useEffect(() => {
    getSeatData();
  }, []);

  const getSeatData = async () => {
    await axiosApi
      .get("normal-user/view-seats/?bus_id=7")
      .then((res) => {
        setSeatDetails(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  return (
    <div>
      <Grid container spacing={12} justifyContent="space-evenly">
        <Grid item md={6} xs={12} sm={6}>
          <span style={{ color: "cornflowerblue" }}>Lower Deck</span>
          <Card sx={{ width: 300, border: 1 }}>
            <CardContent>
              <Grid container>
                <Grid item xs={9}></Grid>
                <Grid item xs={3}>
                  <img src={driver} alt="driver" />
                </Grid>
              </Grid>

              <UserLayer data={seatDetails} row={1} />
              <UserLayer data={seatDetails} row={2} />
              <UserLayer data={seatDetails} row={3} />
              <UserLayer data={seatDetails} row={4} />
              <UserLayer data={seatDetails} row={5} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item md={6} xs={12} sm={6}>
          <span style={{ color: "cornflowerblue" }}>Upper Deck</span>
          <Card sx={{ width: 300, border: 1 }}>
            <CardContent>
              <Grid container>
                <Grid item xs={9}></Grid>
                <Grid item xs={3}>
                  <HorizontalRuleIcon sx={{ color: "white" }} />{" "}
                </Grid>
              </Grid>
              <UserLayer data={seatDetails} row={6} />
              <UserLayer data={seatDetails} row={7} />
              <UserLayer data={seatDetails} row={8} />
              <UserLayer data={seatDetails} row={9} />
              <UserLayer data={seatDetails} row={10} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
