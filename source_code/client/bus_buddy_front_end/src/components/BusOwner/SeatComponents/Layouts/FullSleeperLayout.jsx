import { React, useEffect, useContext } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Grid } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FullSleeperLayer from "../Layers/FullSleeperLayer";
import driver from "../../../../assets/driver.png";
import { AddSeatContext } from "../../../../utils/AddSeatContext";
import { axiosApi } from "../../../../utils/axiosApi";

export default function FullSleeperLayout(props) {
  const { updateCurrentData, reRender, updateIsClicked } =
    useContext(AddSeatContext);

  useEffect(() => {
    updateIsClicked(false);
    console.log(reRender);
    axiosApi
      .get(`bus-owner/get-seat-details?bus_id=${props.bus}`)
      .then((res) => {
        updateCurrentData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.bus, reRender]);

  return (
    <Grid container spacing={12} justifyContent="space-evenly">
      <Grid item lg={12} md={12} xs={12} sm={12}>
        <span style={{ color: "cornflowerblue" }}>Lower Deck</span>
        <Card sx={{ width: 300, border: 1 }}>
          <CardContent>
            <Grid container>
              <Grid item xs={9}></Grid>
              <Grid item xs={3}>
                <img src={driver} alt="driver" draggable={false} />
              </Grid>
            </Grid>
            <FullSleeperLayer row={1} />
            <FullSleeperLayer row={2} />
            <FullSleeperLayer row={3} />
            <FullSleeperLayer row={4} />
            <FullSleeperLayer row={5} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item lg={12} md={12} xs={12} sm={12}>
        <span style={{ color: "cornflowerblue" }}>Upper Deck</span>
        <Card sx={{ width: 300, border: 1 }}>
          <CardContent>
            <Grid container>
              <Grid item xs={9}></Grid>
              <Grid item xs={3}>
                <AddCircleOutlineIcon sx={{ color: "white" }} />
              </Grid>
            </Grid>
            <FullSleeperLayer row={6} />
            <FullSleeperLayer row={7} />
            <FullSleeperLayer row={8} />
            <FullSleeperLayer row={9} />
            <FullSleeperLayer row={10} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
