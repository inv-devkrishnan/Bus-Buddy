import React, { useState, useEffect } from "react";
import { Typography, Card, CardContent, Table } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function PickAndDrop() {
  const [selectedRowId, setSelectedRowId] = useState(null);

  const columns = [
    {
      field: "stops",
      headerName: "Stops",
      width: 150,
      editable: true,
    },
  ]

  const rowsPick = [
    { id: 1, stops: "Jonyoukonwnothingjohnsnow" },
    { id: 2, stops: "Cersei", age: 42 },
    { id: 3, stops: "Jaime", age: 45 },
    { id: 4, stops: "Arya", age: 16 },
    { id: 5, stops: "Daenerys", age: null },
    { id: 6, stops: null, age: 150 },
    { id: 7, stops: "Ferrara", age: 44 },
    { id: 8, stops: "Rossini", age: 36 },
    { id: 9, stops: "Harvey", age: 65 },
  ];
  const handleSelectionChange = (newSelection) => {
    if (newSelection.length === 1) {
      setSelectedRowId(newSelection[0]);
    } else {
      setSelectedRowId(null); // No row selected or multiple rows selected
    }
    console.log(selectedRowId);

  };

  return (
    <Card className="m-2 p-3">
      <Typography gutterBottom variant="h5" component="div">
        Pick up and Drop off points
      </Typography>
      <CardContent className="d-flex">
          <div style={{ height: 386, width: "100%" }}>
          Pick
            <DataGrid
              rows={rowsPick}
              columns={columns}
              pagination
              autoPageSize
              checkboxSelection
              onRowClick={handleSelectionChange}
            />
          </div>
          <div style={{ height: 386, width: "100%" }}>
          Drop
            <DataGrid
              rows={rowsPick}
              columns={columns}
              autoPageSize
              checkboxSelection
            />
          </div>
      </CardContent>
    </Card>
  );
}
