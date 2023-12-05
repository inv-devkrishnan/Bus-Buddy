import React, { useContext, useState, useEffect } from "react";
import "./PickAndDrop.css";
import { Typography, Card, CardContent, Radio } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";

import { SeatContext } from "../../utils/SeatContext";

export default function PickAndDrop(props) {
  const [pick, setPick] = useState([]); // for storing pick up data
  const [drop, setDrop] = useState([]); // for storing drop off data
  const { seatData } = useContext(SeatContext); // use context with seat data

  useEffect(() => {
    const pickRows = seatData[0].map((stop) => ({
      // for mapping pick point data as rows according to columns
      // seatData[0] holds pick points
      id: stop.id,
      stops: `${stop.bus_stop} (${stop.arrival_time})`,
    }));
    if (pickRows) {
      setPick(pickRows);
    }
    const dropRows = seatData[1].map((stop) => ({
      // for mapping drop point data as rows according to columns
      // seatData[1] holds drop points
      id: stop.id,
      stops: `${stop.bus_stop} (${stop.arrival_time})`,
    }));
    if (dropRows) {
      setDrop(dropRows);
    }
  }, [seatData]);

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
      <CardContent className="d-flex flex-column flex-lg-row justify-content-around m-3 p-1">
        <div className="media-query-div">
          <Typography gutterBottom variant="body1" component="div">
            Pick Up point
          </Typography>
          <DataGrid
            disableRowSelectionOnClick
            rows={pick}
            columns={columnsPick}
            pagination
            autoPageSize
            getRowHeight={() => "auto"}
            getEstimatedRowHeight={() => 200}
            selectionModel={props.selectionModelPick}
            onSelectionModelChange={(newSelectionModel) => {
              props.setSelectionModelPick(newSelectionModel);
            }}
            sx={{
              "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": {
                py: "4px",
              },
              "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
                py: "7px",
              },
              "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
                py: "11px",
              },
            }}
          />
        </div>
        <div className="media-query-div">
          <Typography gutterBottom variant="body1" component="div">
            Drop Off point
          </Typography>
          <DataGrid
            disableRowSelectionOnClick
            rows={drop}
            columns={columnsDrop}
            autoPageSize
            getRowHeight={() => "auto"}
            getEstimatedRowHeight={() => 200}
            selectionModel={props.selectionModelDrop}
            onSelectionModelChange={(newSelectionModel) => {
              props.setSelectionModelDrop(newSelectionModel);
            }}
            sx={{
              "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": {
                py: "4px",
              },
              "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
                py: "7px",
              },
              "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
                py: "11px",
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
PickAndDrop.propTypes = {
  selectionModelPick: PropTypes.array,
  setSelectionModelPick: PropTypes.func,
  selectionModelDrop: PropTypes.array,
  setSelectionModelDrop: PropTypes.func,
};
