import { React } from "react";
import Grid from "@mui/material/Grid";
import Sleeper from "./Sleeper";

export default function Layer() {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={4}>
        <Grid>
          <Sleeper />
    </Grid>
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={2}>
          <Sleeper />
        </Grid>
        <Grid item xs={2}>
          <Sleeper />
        </Grid>
      </Grid>
    </div>
  );
}