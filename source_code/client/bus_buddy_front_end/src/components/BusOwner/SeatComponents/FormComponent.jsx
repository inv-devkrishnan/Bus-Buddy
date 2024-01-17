import { React, useEffect, useContext } from "react";
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
  Typography,
} from "@mui/material";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

import { useFormik } from "formik";
import Swal from "sweetalert2";

import { FormComponentSchema } from "./FormComponentSchema";
import { AddSeatContext } from "../../../utils/AddSeatContext";
import { axiosApi } from "../../../utils/axiosApi";

export default function FormComponent(props) {
  const {
    propsData,
    currentData,
    currentSeatData,
    updateCurrentSeatData,
    reRender,
    updateReRender,
  } = useContext(AddSeatContext); // use context holds ui order,current data and for storing current data

  useEffect(() => {
    // for setting current seat data using ui order(propsData)
    for (let i of currentData) {
      if (propsData === i.seat_ui_order) {
        updateCurrentSeatData(i);
        break;
      } else {
        updateCurrentSeatData([]);
        resetForm();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propsData]);

  useEffect(() => {
    // for setting values to test box after api call
    if (currentSeatData["seat_ui_order"] === propsData) {
      formik.setValues({
        seatNumber: currentSeatData["seat_number"],
        seatType: currentSeatData["seat_type"],
        deck: currentSeatData["deck"],
        seatCost: currentSeatData["seat_cost"],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSeatData]);

  const onSubmit = () => {
    // api call for storing seat details
    axiosApi
      .post("http://127.0.0.1:8000/bus-owner/add-seat-details", {
        bus: props.bus,
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
          updateReRender(!reRender);
        }
      })
      .catch((err) => {
        console.log(err);
        let error;
        if (err.response.data.seat_ui_order) {
          error = err.response.data.seat_ui_order;
        } else if (err.response.data.data) {
          error = err.response.data.data;
        } else {
          error = err.response.data.error;
        }

        Swal.fire({
          // displays error message
          icon: "error",
          title: "Oops...",
          text: error,
        });
      });
  };

  const formik = useFormik({
    // formik initialisation
    initialValues: {
      seatNumber: "",
      seatType: 0,
      deck: 0,
      seatCost: "",
    },
    validationSchema: FormComponentSchema,
    onSubmit,
  });

  const { resetForm } = formik; // when called resets the form

  return (
    <div>
      <Card sx={{ width: "20rem", margin: 5, boxShadow: 4 }}>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          noValidate
          sx={{ margin: 2 }}
        >
          <Typography>id: {propsData}</Typography>
          <FormControl fullWidth margin="normal">
            <TextField
              id="seatNumber"
              label="Seat number"
              variant="outlined"
              name="seatNumber"
              value={formik.values.seatNumber}
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
              value={formik.values.seatType}
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
              onChange={(e) =>
                formik.setFieldValue("deck", parseInt(e.target.value))
              }
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
              value={formik.values.seatCost}
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
          {currentSeatData["seat_ui_order"] === propsData ? (
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
