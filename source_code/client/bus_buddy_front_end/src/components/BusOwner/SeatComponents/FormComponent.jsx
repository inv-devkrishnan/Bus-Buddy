import { React, useState, useEffect, useContext } from "react";
import {
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Box,
  Button,
  Card,
  FormHelperText,
} from "@mui/material";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import { FormComponentSchema } from "./FormComponentSchema";
import axios from "axios";
import { ShowFormContext } from "../../../utils/ShowFormContext";

export default function FormComponent() {
  const { propsData } = useContext(ShowFormContext);//holds seat ui order
  const [currentData, setCurrentData] = useState([]);

  useEffect(() => {
    axios
      .get(
        `http://127.0.0.1:8000/bus-owner/get-seat-details?seat_ui_order=${propsData}&&bus_id=7`
      )
      .then((res) => {
        setCurrentData(res.data);
      })
      .catch((err) => {});
  }, [propsData]);

  console.log(currentData["deck"]);
  useEffect(() => {
    formik.setValues({
      seatNumber: currentData["seat_number"],
      seatType: currentData["seat_type"],
      deck: currentData["deck"],
      seatCost: currentData["seat_cost"],
    });
  }, [currentData]);

  const onSubmit = () => {
    axios
      .post("http://127.0.0.1:8000/bus-owner/add-seat-details", {
        bus: 7,
        seat_ui_order: propsData,
        seat_number: formik.values.seatNumber,
        seat_type: formik.values.seatType,
        deck: formik.values.deck,
        seat_cost: formik.values.seatCost,
      })
      .then((res) => {
        if (res.status === 201) {
          Swal.fire("Success!", "Seat added successfully!", "success");
          resetForm();
        }
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.data.seat_ui_order) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err.response.data.seat_ui_order,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err.response.data,
          });
        }
      });
  };

  const formik = useFormik({
    initialValues: {
      seatNumber: "",
      seatType: "",
      deck: "",
      seatCost: 0,
    },
    validationSchema: FormComponentSchema,
    onSubmit,
  });

  const { resetForm } = formik;

  return (
    <div>
      <Card
        sx={{ width: "20rem", margin: 5,boxShadow:4 }}
      >
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          noValidate
          sx={{ margin: 2 }}
        >
          <FormControl fullWidth margin="normal">
            <TextField
              id="seatNumber"
              label="Seat number"
              variant="outlined"
              name="seatNumber"
              value={formik.values.seatNumber || ""}
              onChange={formik.handleChange}
              error={
                formik.touched.seatNumber && Boolean(formik.errors.seatNumber)
              }
              helperText={formik.touched.seatNumber && formik.errors.seatNumber}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="seatType">Seat type</InputLabel>
            <Select
              id="seatType"
              name="seatType"
              label="Seat type"
              variant="outlined"
              value={formik.values.seatType || ""}
              onChange={formik.handleChange}
              error={formik.touched.seatType && Boolean(formik.errors.seatType)}
            >
              <MenuItem value={0}>Seater</MenuItem>
              <MenuItem value={1}>Sleeper</MenuItem>
            </Select>
            <FormHelperText error>
              {formik.touched.seatType && formik.errors.seatType}
            </FormHelperText>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="seatType">Deck</InputLabel>
            <Select
              id="deck"
              name="deck"
              label="Deck"
              variant="outlined"
              value={formik.values.deck}
              onChange={formik.handleChange}
              error={formik.touched.deck && Boolean(formik.errors.deck)}
            >
              <MenuItem value={0}>Lower deck</MenuItem>
              <MenuItem value={1}>Upper deck</MenuItem>
            </Select>
            <FormHelperText error>
              {formik.touched.deck && formik.errors.deck}
            </FormHelperText>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              id="seatCost"
              name="seatCost"
              label="Seat cost"
              variant="outlined"
              value={formik.values.seatCost || ""}
              onChange={formik.handleChange}
              error={formik.touched.seatCost && Boolean(formik.errors.seatCost)}
              helperText={formik.touched.seatCost && formik.errors.seatCost}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CurrencyRupeeIcon />
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
          <FormHelperText>
            Once submitted you cannot edit the content.
          </FormHelperText>
          {currentData["seat_ui_order"] ? (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled
            >
              Submit
            </Button>
          ) : (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Submit
            </Button>
          )}
        </Box>
      </Card>
    </div>
  );
}
