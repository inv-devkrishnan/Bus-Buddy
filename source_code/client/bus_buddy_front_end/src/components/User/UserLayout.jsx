import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Grid } from "@mui/material";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";

import UserLayer from "./UserLayer";
import driver from "../../assets/images/driver.png";
import { axiosOpenApi } from "../../utils/axiosApi";

export default function UserLayout() {
  const [lowerDeck, setLowerDeck] = useState([]);
  const [upperDeck, setUpperDeck] = useState([]);
  useEffect(() => {
    getSeatDetails();
  }, []);

  const getSeatDetails = async () => {
    await axiosOpenApi.get("normal-user/view-seats/?bus_id=1").then((result) => {
      console.log(result.data);
      let layers = [];
      while (result.data.lower_deck.length > 0) {
        layers.push(result.data.lower_deck.splice(0, 3));
      }
      console.log(layers);
      setLowerDeck(layers);
      layers =[];
      while (result.data.upper_deck.length > 0) {
        layers.push(result.data.upper_deck.splice(0, 3));
      }
      console.log(layers);
      setUpperDeck(layers);
    });
  };
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <span style={{ color: "cornflowerblue" }}>Lower Deck</span>
          <Card sx={{ width: 300, border: 1 }}>
            {lowerDeck.length > 0 && (
              <CardContent>
                <Grid container>
                  <Grid item xs={9}></Grid>
                  <Grid item xs={3}>
                    {" "}
                    <img src={driver} alt="driver" />
                  </Grid>
                </Grid>

                <UserLayer seats={lowerDeck[0]} />
                <UserLayer seats={lowerDeck[1]} />
                <UserLayer seats={lowerDeck[2]} />
                <UserLayer seats={lowerDeck[3]} />
                <UserLayer seats={lowerDeck[4]} />
              </CardContent>
            )}
          </Card>
        </Grid>
        <Grid item xs={5}>
          <span style={{ color: "cornflowerblue" }}>Upper Deck</span>
          <Card sx={{ width: 300, border: 1 }}>
            {upperDeck.length > 0 && (
              <CardContent>
                <Grid container>
                  <Grid item xs={9}></Grid>
                  <Grid item xs={3}>
                    {" "}
                    <HorizontalRuleIcon sx={{ color: "white" }} />{" "}
                  </Grid>
                </Grid>
                <UserLayer seats={upperDeck[0]} />
                <UserLayer seats={upperDeck[1]} />
                <UserLayer seats={upperDeck[2]} />
                <UserLayer seats={upperDeck[3]} />
                <UserLayer seats={upperDeck[4]} />
              </CardContent>
            )}
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}