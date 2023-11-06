import React, { useContext, useState } from "react";

import { Typography, Card, CardContent, Radio } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { SeatContext } from "../../utils/SeatContext";

export default function PickAndDrop() {
  const { seatData } = useContext(SeatContext);// use context with seat data
  const [selectionModelPick, setSelectionModelPick] = useState([]);// for storing pick up point id
  const [selectionModelDrop, setSelectionModelDrop] = useState([]);// for stroring drop off point id

  const rows = seatData[0].map((stop) => ({
    // for mapping pick and drop point data as rows according to columns
    id: stop.id,
    stops: stop.bus_stop
}));


  const columnsPick = [
    // holds the column details of pick up point datagrid
    {
      field: "radioButton",
      headerName: "",
      width: 100,
      sortable: false,
      filterable: false,
      editable: false,
      hideable: false,
      renderCell: (params) => (
        <Radio
          checked={selectionModelPick.includes(params.id)}
          onChange={() => {
            if (selectionModelPick.includes(params.id)) {
              setSelectionModelPick([]);
            } else {
              setSelectionModelPick([params.id]);
            }
          }}
          value={params.id}
        />
      ),
    },
    {
      field: "stops",
      headerName: "Stops",
      width: 150,
      editable: false,
      hideable: false,
    },
  ];

  const columnsDrop = [
    // holds the column details of drop off point datagrid
    {
      field: "radioButton",
      headerName: "",
      width: 100,
      sortable: false,
      filterable: false,
      editable: false,
      hideable: false,
      renderCell: (params) => (
        <Radio
          checked={selectionModelDrop.includes(params.id)}
          onChange={() => {
            if (selectionModelDrop.includes(params.id)) {
              setSelectionModelDrop([]);
            } else {
              setSelectionModelDrop([params.id]);
            }
          }}
          value={params.id}
        />
      ),
    },
    {
      field: "stops",
      headerName: "Stops",
      width: 150,
      editable: false,
      hideable: false,
    },
  ];

  console.log(selectionModelPick[0]);
  console.log(selectionModelDrop[0]);

  return (
    <Card className="m-2 p-3" sx={{ boxShadow: 5 }}>
      <Typography gutterBottom variant="h5" component="div">
        Pick up and Drop off points
      </Typography>
      <CardContent className="d-flex">
        <div style={{ height: 372, width: "100%" }}>
          <h6>Pick Up point</h6>
          <DataGrid
            rows={rows}
            columns={columnsPick}
            pagination
            autoPageSize
            selectionModel={selectionModelPick}
            onSelectionModelChange={(newSelectionModel) => {
              setSelectionModelPick(newSelectionModel);
            }}
          />
        </div>
        <div style={{ height: 372, width: "100%" }}>
          <h6>Drop Off point</h6>
          <DataGrid
            rows={rows}
            columns={columnsDrop}
            autoPageSize
            selectionModel={selectionModelDrop}
            onSelectionModelChange={(newSelectionModel) => {
              setSelectionModelDrop(newSelectionModel);
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
