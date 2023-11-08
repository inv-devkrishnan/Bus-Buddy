import { React } from "react";
import Grid from "@mui/material/Grid";
import Sleeper from "../Sleeper";

export default function FullSleeperLayer(props) {

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Grid>
            <Sleeper column={1} row={props.row} />
          </Grid>
        </Grid>

        <Grid item xs={2}></Grid>

        <Grid item xs={2}>
          <Sleeper column={2} row={props.row} />
        </Grid>

        <Grid item xs={2}>
          <Sleeper column={3} row={props.row} />
        </Grid>
      </Grid>
    </div>
  );
}
