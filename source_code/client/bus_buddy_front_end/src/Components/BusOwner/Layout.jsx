import { React } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Grid } from "@mui/material";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import Layer from "./Layer";
import driver from "../../Assests/driver.png";

export default function Layout() {
  return (
        <Grid container spacing={2}>
          <Grid item md={3} xs={6}>
            <span style={{ color: "cornflowerblue" }}>Lower Deck</span>
            <Card sx={{ width: 300, border: 1 }}>
              <CardContent>
                <Grid container>
                  <Grid item xs={9}></Grid>
                  <Grid item xs={3}>
                    {" "}
                    <img src={driver} alt="driver" />
                  </Grid>
                </Grid>
                <Layer />
                <Layer />
                <Layer />
                <Layer />
                <Layer />
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={3} xs={6}>
            <span style={{ color: "cornflowerblue" }}>Upper Deck</span>
            <Card sx={{ width: 300, border: 1 }}>
              <CardContent>
                <Grid container>
                  <Grid item xs={9}></Grid>
                  <Grid item xs={3}>
                    {" "}
                    <HorizontalRuleIcon sx={{ color: "white" }} />{" "}
                  </Grid>
                </Grid>
                <Layer />
                <Layer />
                <Layer />
                <Layer />
                <Layer />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
  );
}
