import { React } from "react";
import Grid from "@mui/material/Grid";
import UserSleeper from "./UserSleeper";
export default function Layer() {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Grid>
            <UserSleeper />
          </Grid>
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={2}>
          <UserSleeper />
        </Grid>
        <Grid item xs={2}>
          <UserSleeper />
        </Grid>
      </Grid>
    </div>
  );
}
