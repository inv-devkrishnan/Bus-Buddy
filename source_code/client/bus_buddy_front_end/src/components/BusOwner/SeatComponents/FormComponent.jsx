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
  const [changedSeatType, setChangedSeatType] = useState("");

  useEffect(() => {
    // for setting current seat data using ui order(propsData)
    if (currentData && Array.isArray(currentData)) {
      for (let i of currentData) {
        if (propsData === i.seat_ui_order) {
          updateCurrentSeatData(i);
          break;
        } else {
          updateCurrentSeatData([]);
          resetForm();
        }
      }
    } else {
      updateCurrentSeatData([]);
      resetForm()
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
      .post("bus-owner/add-seat-details", {
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
        } else {
          console.log(res);
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

  const seatTypeMenu = (type) => {
    if (type === 0) {
      return [
        <MenuItem key={1} value={1}>
          Sleeper
        </MenuItem>,
      ];
    } else if (type === 1) {
      return [
        <MenuItem key={0} value={0}>
          Seater
        </MenuItem>,
      ];
    } else {
      return [
        <MenuItem key={0} value={0}>
          Seater
        </MenuItem>,
        <MenuItem key={1} value={1}>
          Sleeper
        </MenuItem>,
      ];
    }
  };

  const seatTypeInitialValue = () => {
    if (props.seatType === 0) {
      return "1";
    } else if (props.seatType === 1) {
      return "0";
    } else {
      return changedSeatType;
    }
  };

  const floorValue = Math.floor(propsData / 10);

  const deckTypeMenu = () => {
    if (floorValue < 6) {
      return [
        <MenuItem key={0} value={0}>
          Lower deck
        </MenuItem>,
      ];
    } else {
      return [
        <MenuItem key={1} value={1}>
          Upper deck
        </MenuItem>,
      ];
    }
  };

  const formik = useFormik({
    // formik initialisation
    initialValues: {
      seatNumber: "",
      seatType: seatTypeInitialValue(),
      deck: "",
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
              data-testid="seat_number"
              id="seatNumber"
              label="Enter seat number"
              variant="outlined"
              name="seatNumber"
              inputProps={{ maxLength: 50 }}
              value={formik.values.seatNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.seatNumber && Boolean(formik.errors.seatNumber)
              }
              helperText={formik.touched.seatNumber && formik.errors.seatNumber}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="seatType">Seat type</InputLabel>
            <Select
              data-testid="seat_type"
              id="seatType"
              name="seatType"
              label="Seat type"
              variant="outlined"
              value={formik.values.seatType}
              onChange={(e) => {
                formik.setFieldValue("seatType", parseInt(e.target.value));
                setChangedSeatType(parseInt(e.target.value));
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.seatType && Boolean(formik.errors.seatType)}
            >
              {seatTypeMenu(props.seatType)}
            </Select>
            <FormHelperText error>
              {formik.touched.seatType && formik.errors.seatType}
            </FormHelperText>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="seatType">Deck</InputLabel>
            <Select
              data-testid="deck"
              id="deck"
              name="deck"
              label="Deck"
              variant="outlined"
              value={formik.values.deck}
              onChange={(e) =>
                formik.setFieldValue("deck", parseInt(e.target.value))
              }
              onBlur={formik.handleBlur}
              error={formik.touched.deck && Boolean(formik.errors.deck)}
            >
              {deckTypeMenu()}
            </Select>
            <FormHelperText error>
              {formik.touched.deck && formik.errors.deck}
            </FormHelperText>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              data-testid="seat_cost"
              id="seatCost"
              name="seatCost"
              label="Enter seat cost"
              variant="outlined"
              value={formik.values.seatCost}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
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
