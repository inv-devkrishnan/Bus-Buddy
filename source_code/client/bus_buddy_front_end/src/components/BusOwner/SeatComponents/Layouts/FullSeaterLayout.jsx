import { React, useEffect, useContext } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Grid } from "@mui/material";
import FullSeaterLayer from "../Layers/FullSeaterLayer";
import driver from "../../../../assets/driver.png";
import { AddSeatContext } from "../../../../utils/AddSeatContext";
import axios from "axios";

export default function FullSeaterLayout() {

  const { updateCurrentData } = useContext(AddSeatContext);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get("http://127.0.0.1:8000/bus-owner/get-seat-details?bus_id=9")
      .then((res) => {
        updateCurrentData(res.data);
      })
      .catch((err) => {
        console.log("error");
      });
  };
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
            <FullSeaterLayer layer={1} />
            <FullSeaterLayer layer={2} />
            <FullSeaterLayer layer={3} />
            <FullSeaterLayer layer={4} />
            <FullSeaterLayer layer={5} />
            <FullSeaterLayer layer={6} />
            <FullSeaterLayer layer={7} />
            <FullSeaterLayer layer={8} />
            <FullSeaterLayer layer={9} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
