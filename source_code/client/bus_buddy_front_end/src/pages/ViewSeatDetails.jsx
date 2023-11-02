import { React} from "react";
import UserLayout from "../components/User/UserLayout";
import SeatDetailCard from "../components/User/SeatDetailCard";
import Grid from '@mui/material/Grid';
export default function ViewSeatDetails() {
  return (
    <div>
      <Grid container spacing={2} margin={1}>
      <Grid item xs={8} md={6}>
        <UserLayout />
      </Grid>
    </Grid>
    <div style={{display:"flex"}}>
        <SeatDetailCard/>
    </div>

    </div>
    
  );
}
