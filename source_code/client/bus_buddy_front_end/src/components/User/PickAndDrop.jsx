import React, { useContext, useState, useEffect } from "react";
import "./PickAndDrop.css";
import { Typography, Card, CardContent, Radio } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";

import { SeatContext } from "../../utils/SeatContext";

export default function PickAndDrop(props) {
  const [pick, setPick] = useState([]);
  const [drop, setDrop] = useState([]);
  const { seatData } = useContext(SeatContext);

  useEffect(() => {
    const storedPickUp = localStorage.getItem("pick_up");
    const storedDropOff = localStorage.getItem("drop_off");

    if (storedPickUp && storedDropOff) {
      props.setSelectionModelPick(storedPickUp);
      props.setSelectionModelDrop(storedDropOff);
      props.setSelectedPickStop(localStorage.getItem("pick_stop"));
      props.setSelectedDropStop(localStorage.getItem("drop_stop"));
    }
  }, [props]);

  useEffect(() => {
    const pickRows = seatData[0]?.map((stop) => ({
      // for mapping pick point data as rows according to columns
      // seatData[0] holds pick points
      id: stop.id,
      stops: `${stop.bus_stop} (${stop.arrival_time})`,
    }));
    if (pickRows) {
      setPick(pickRows);
    }
    const dropRows = seatData[1]?.map((stop) => ({
      // for mapping drop point data as rows according to columns
      // seatData[1] holds drop points
      id: stop.id,
      stops: `${stop.bus_stop} (${stop.arrival_time})`,
    }));
    if (dropRows) {
      setDrop(dropRows);
    }
  }, [seatData]);

  const handlePickSelection = (params) => {
    const selectedPickId = params.id;

    if (props.selectionModelPick.includes(selectedPickId)) {
      props.setSelectionModelPick([]);
      props.setSelectedPickStop([]);
    } else {
      props.setSelectionModelPick([selectedPickId]);
      props.setSelectedPickStop(params.row.stops);
    }

    // Update localStorage with the new selection
    localStorage.setItem("pick_up", [selectedPickId]);
    localStorage.setItem("pick_stop", params.row.stops);
  };

  const handleDropSelection = (params) => {
    const selectedDropId = params.id;

    if (props.selectionModelDrop.includes(selectedDropId)) {
      props.setSelectionModelDrop([]);
      props.setSelectedDropStop([]);
    } else {
      props.setSelectionModelDrop([selectedDropId]);
      props.setSelectedDropStop(params.row.stops);
    }

    // Update localStorage with the new selection
    localStorage.setItem("drop_off", [selectedDropId]);
    localStorage.setItem("drop_stop", params.row.stops);
  };

  const columnsPick = [
    {
      field: "radioButton",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      editable: false,
      hideable: false,
      renderCell: (params) => (
        <Radio
          checked={props.selectionModelPick.includes(params.id)}
          onChange={() => handlePickSelection(params)}
          value={params.id}
        />
      ),
    },
    {
      field: "stops",
      headerName: "Stops",
      headerClassName: "bold-header",
      width: 150,
      editable: false,
      hideable: false,
    },
  ];

  const columnsDrop = [
    {
      field: "radioButton",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      editable: false,
      hideable: false,
      renderCell: (params) => (
        <Radio
          checked={props.selectionModelDrop.includes(params.id)}
          onChange={() => handleDropSelection(params)}
          value={params.id}
        />
      ),
    },
    {
      field: "stops",
      headerName: "Stops",
      headerClassName: "bold-header",
      width: 150,
      editable: false,
      hideable: false,
    },
  ];

  return (
    <Card
      className="m-2 p-3"
      sx={{ width: "70%", height: "auto", boxShadow: 5 }}
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
            disableColumnMenu
            disableRowSelectionOnClick
            rows={pick}
            columns={columnsPick}
            pageSizeOptions={[5]}
            getRowHeight={() => "auto"}
            getEstimatedRowHeight={() => 300}
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
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "bold",
              },
            }}
          />
        </div>
        <div className="media-query-div">
          <Typography gutterBottom variant="body1" component="div">
            Drop Off point
          </Typography>
          <DataGrid
            disableColumnMenu
            disableRowSelectionOnClick
            rows={drop}
            columns={columnsDrop}
            pageSizeOptions={[5]}
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
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "bold",
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
  setSelectedPickStop: PropTypes.func,
  setSelectedDropStop: PropTypes.func,
};
