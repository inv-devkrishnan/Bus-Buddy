import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Grid } from "@mui/material";
import UserLayer from "./UserLayer";
import driver from "../../Assests/driver.png";

export default function UserLayout() {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Card sx={{ width: 300 }}>
            <CardContent>
              <Grid container>
                <Grid item xs={9}></Grid>
                <Grid item xs={3}>
                  {" "}
                  <img src={driver} alt="driver" />
                </Grid>
              </Grid>
              <UserLayer />
              <UserLayer />
              <UserLayer />
              <UserLayer />
              <UserLayer />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card sx={{ width: 300 }}>
            <CardContent>
              <UserLayer />
              <UserLayer />
              <UserLayer />
              <UserLayer />
              <UserLayer />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
