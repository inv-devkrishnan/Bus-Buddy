import React, { useContext, useState } from "react";

import { Typography, Card, CardContent, Radio } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { SeatContext } from "../../utils/SeatContext";

export default function PickAndDrop(props) {
  const { seatData } = useContext(SeatContext); // use context with seat data
  const rows = seatData[0].map((stop) => ({
    // for mapping pick and drop point data as rows according to columns
    // seatData[0] holds pick and drop points
    id: stop.id,
    stops: stop.bus_stop,
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
          checked={props.selectionModelPick.includes(params.id)}
          onChange={() => {
            if (props.selectionModelPick.includes(params.id)) {
              props.setSelectionModelPick([]);
            } else {
              props.setSelectionModelPick([params.id]);
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
          checked={props.selectionModelDrop.includes(params.id)}
          onChange={() => {
            if (props.selectionModelDrop.includes(params.id)) {
              props.setSelectionModelDrop([]);
            } else {
              props.setSelectionModelDrop([params.id]);
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

  return (
    <Card
      className="p-3"
      sx={{ width: "90%", height: "auto", margin: 4, boxShadow: 5 }}
    >
      <Typography gutterBottom variant="h5">
        Pick up and Drop off points
      </Typography>
      <CardContent className="d-flex flex-lg-row flex-sm-column flex-xs-column flex-md-row">
        <div style={{ height: 375, width: "50%", margin: 4 }}>
          <Typography gutterBottom variant="body1" component="div">
            Pick Up point
          </Typography>
          <DataGrid
            rows={rows}
            columns={columnsPick}
            pagination
            autoPageSize
            getRowHeight={() => "auto"}
            selectionModel={props.selectionModelPick}
            onSelectionModelChange={(newSelectionModel) => {
              props.setSelectionModelPick(newSelectionModel);
            }}
            sx={{
              "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": {
                py: "8px",
              },
              "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
                py: "15px",
              },
              "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
                py: "22px",
              },
            }}
          />
        </div>
        <div style={{ height: 375, width: "50%", margin: 4 }}>
          <Typography gutterBottom variant="body1" component="div">
            Drop Off point
          </Typography>
          <DataGrid
            rows={rows}
            columns={columnsDrop}
            autoPageSize
            getRowHeight={() => "auto"}
            selectionModel={props.selectionModelDrop}
            onSelectionModelChange={(newSelectionModel) => {
              props.setSelectionModelDrop(newSelectionModel);
            }}
            sx={{
              "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": {
                py: "8px",
              },
              "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
                py: "15px",
              },
              "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
                py: "22px",
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
