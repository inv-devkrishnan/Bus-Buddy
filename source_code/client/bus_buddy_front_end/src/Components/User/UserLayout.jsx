import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Grid } from "@mui/material";
import UserLayer from "./UserLayer";
import driver from "../../Assests/driver.png";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";

export default function UserLayout() {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <span style={{color:"cornflowerblue"}}>Lower Deck</span>
          <Card sx={{ width: 300, border: 1 }}>
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
          <span style={{color:"cornflowerblue"}}>Upper Deck</span>
          <Card sx={{ width: 300, border: 1 }}>
            <CardContent>
              <Grid container>
                <Grid item xs={9}></Grid>
                <Grid item xs={3}>
                  {" "}
                  <HorizontalRuleIcon sx={{color:"white"}}/>{" "}
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
      </Grid>
    </div>
  );
}
