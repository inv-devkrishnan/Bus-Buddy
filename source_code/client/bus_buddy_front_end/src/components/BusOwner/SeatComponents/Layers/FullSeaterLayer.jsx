import { React } from "react";
import Grid from "@mui/material/Grid";
import Seater from "../Seater";

export default function FullSleeperLayer(layer) {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Grid item xs={2}>
            <Seater column={2} row={layer.layer} />
          </Grid>

        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={2}>
          <Seater column={2} row={layer.layer} />
        </Grid>
        <Grid item xs={2}>
          <Seater column={3} row={layer.layer} />
        </Grid>
      </Grid>
    </div>
  );
}
