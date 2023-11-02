import { React } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Grid } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FullSleeperLayer from "../Layers/FullSleeperLayer";
import SingleSeaterDoubleSleeperLayer from "../Layers/SingleSeaterDoubleSleeperLayer";
import TwoSeaterForTwoSleeperLayout from "../Layers/TwoSeaterForTwoSleeperLayout";
import driver from "../../../../assests/driver.png";

export default function SingleSeaterDoubleSleeperLayout() {
  return (
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
            <TwoSeaterForTwoSleeperLayout layer={1} />
            <TwoSeaterForTwoSleeperLayout layer={2} />
            <TwoSeaterForTwoSleeperLayout layer={3} />
            <TwoSeaterForTwoSleeperLayout layer={4} />
            <TwoSeaterForTwoSleeperLayout layer={5} />
            <SingleSeaterDoubleSleeperLayer layer={6} />
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
                <AddCircleOutlineIcon sx={{ color: "white" }} />
              </Grid>
            </Grid>
            <div style={{ margin: 11 }}>
              <FullSleeperLayer layer={7} />
            </div>
            <div style={{ margin: 11 }}>
              <FullSleeperLayer layer={8} />
            </div>
            <div style={{ margin: 11 }}>
              <FullSleeperLayer layer={9} />
            </div>
            <div style={{ margin: 11 }}>
              <FullSleeperLayer layer={10} />
            </div>
            <div style={{ margin: 11 }}>
              <FullSleeperLayer layer={11} />
            </div>
            <div style={{ margin: 11 }}>
              <FullSleeperLayer layer={12} />
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
