import { React } from "react";
import Grid from "@mui/material/Grid";
import Sleeper from "../Sleeper";
import Seater from "../Seater";

export default function SingleSeaterDoubleSleeperLayer(layer) {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Grid>
            <Seater column={1} row={layer.layer} />
          </Grid>
        </Grid>

        <Grid item xs={2}></Grid>

        <Grid item xs={2}>
          <Sleeper column={2} row={layer.layer} />
        </Grid>
        
        <Grid item xs={2}>
          <Sleeper column={3} row={layer.layer} />
        </Grid>
      </Grid>
    </div>
  );
}
