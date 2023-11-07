import { React } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Grid } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FullSleeperLayer from "../Layers/FullSleeperLayer";
import driver from "../../../../assets/driver.png";

export default function FullSleeperLayout() {
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
            <FullSleeperLayer layer={1} />
            <FullSleeperLayer layer={2} />
            <FullSleeperLayer layer={3} />
            <FullSleeperLayer layer={4} />
            <FullSleeperLayer layer={5} />
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
            <FullSleeperLayer layer={6} />
            <FullSleeperLayer layer={7} />
            <FullSleeperLayer layer={8} />
            <FullSleeperLayer layer={9} />
            <FullSleeperLayer layer={10} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
