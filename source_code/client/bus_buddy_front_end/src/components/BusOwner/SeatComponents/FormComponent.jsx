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
import * as yup from "yup";

import { AddSeatContext } from "../../../utils/AddSeatContext";
import { axiosApi } from "../../../utils/axiosApi";

export default function FormComponent(props) {
  const {
    propsData,
    currentData,
    updateCurrentSeatData,
    reRender,
    updateReRender,
    addSeatList,
  } = useContext(AddSeatContext); // use context holds ui order,current data and for storing current data
  const [formData, setFormData] = useState([]);

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
  }, [propsData]);

  useEffect(() => {
    if (localStorage.getItem("seat_data")) {
      const array = [JSON.parse(localStorage.getItem("seat_data"))];
      for (let i of array) {
        console.log(array[i]);
      }
    }
  }, []);
  const validationSchema = yup.object().shape(
    addSeatList.reduce((acc, uiOrder) => {
      acc[uiOrder] = yup.object().shape({
        [`seatNumber-${uiOrder}`]: yup
          .string()
          .required("Seat number is required"),
        [`seatType-${uiOrder}`]: yup.number().required("Seat type is required"),
        [`deck-${uiOrder}`]: yup.number().required("Deck is required"),
        [`seatCost-${uiOrder}`]: yup
          .string()
          .matches(/^\d+$/, "Seat cost must be numbers")
          .required("Seat cost is required"),
      });
      return acc;
    }, {})
  );

  const onSubmit = () => {
    // api call for storing seat details
    axiosApi
      .post(`bus-owner/add-seat-details?bus=${props.bus}`, formData)
      .then((res) => {
        if (res.status === 201) {
          Swal.fire("Success!", "Seat added successfully!", "success");
          resetForm();
          updateReRender(!reRender);
        }
      })
      .catch((err) => {
        if (err.response.data.seat_ui_order) {
          Swal.fire({
            // displays error message
            icon: "error",
            title: "Oops...",
            text: err.response.data.seat_ui_order,
          });
        } else {
          Swal.fire({
            // displays error message
            icon: "error",
            title: "Oops...",
            text: err.response.data,
          });
        }
      });
  };

  const formik = useFormik({
    // formik initialisation
    initialValues: addSeatList.reduce((acc, uiOrder) => {
      acc[uiOrder] = {
        [`seatNumber-${uiOrder}`]: "",
        [`seatType-${uiOrder}`]: 0,
        [`deck-${uiOrder}`]: 0,
        [`seatCost-${uiOrder}`]: "",
      };
      return acc;
    }, {}),
    validationSchema,
    onSubmit,
  });
  console.log(formik.values);
  console.log(formik.errors);

  const handleInputChange = (uiOrder, field, value) => {
    // for saving data dynamically using formik with on change property
    formik.setFieldValue(`${uiOrder}.${field}`, value);
    formik.handleBlur(`${uiOrder}.${field}`);
  };

  const { resetForm } = formik; // when called resets the form

  const singleForm = (uiOrder) => {
    return (
      <FormControl key={uiOrder} className="d-flex flex-row m-1">
        <Typography className="m-3">id: {uiOrder}</Typography>
        <FormControl className="m-3" fullWidth margin="normal">
          <TextField
            id={`seatNumber-${uiOrder}`}
            name={`seatNumber-${uiOrder}`}
            label="Seat number"
            variant="outlined"
            value={formik.values[uiOrder]?.[`seatNumber-${uiOrder}`]}
            onChange={(e) =>
              handleInputChange(
                uiOrder,
                `seatNumber-${uiOrder}`,
                e.target.value
              )
            }
            error={
              Boolean(formik.touched[uiOrder]?.[`seatNumber-${uiOrder}`]) &&
              Boolean(formik.errors[uiOrder]?.[`seatNumber-${uiOrder}`])
            }
            helperText={
              formik.touched[uiOrder]?.[`seatNumber-${uiOrder}`] &&
              formik.errors[uiOrder]?.[`seatNumber-${uiOrder}`]
            }
          />
        </FormControl>

        <FormControl className="m-3" fullWidth margin="normal">
          <InputLabel htmlFor="seatType">Seat type</InputLabel>
          <Select
            id={`seatType-${uiOrder}`}
            name={`seatType-${uiOrder}`}
            label="Seat type"
            variant="outlined"
            value={formik.values[uiOrder]?.[`seatType-${uiOrder}`] || 0}
            onChange={(e) =>
              handleInputChange(uiOrder, `seatType-${uiOrder}`, e.target.value)
            }
            error={
              Boolean(formik.touched[uiOrder]?.[`seatType-${uiOrder}`]) &&
              Boolean(formik.errors[uiOrder]?.[`seatType-${uiOrder}`])
            }
          >
            <MenuItem value={0}>Seater</MenuItem>
            <MenuItem value={1}>Sleeper</MenuItem>
          </Select>
          <FormHelperText error>
            {Boolean(formik.touched[uiOrder]?.[`seatType-${uiOrder}`]) &&
              Boolean(formik.errors[uiOrder]?.[`seatType-${uiOrder}`])}
          </FormHelperText>
        </FormControl>

        <FormControl className="m-3" fullWidth margin="normal">
          <InputLabel htmlFor="deck">Deck</InputLabel>
          <Select
            id={`deck-${uiOrder}`}
            name={`deck-${uiOrder}`}
            label="Deck"
            variant="outlined"
            value={formik.values[uiOrder]?.[`deck-${uiOrder}`] || 0}
            onChange={(e) =>
              handleInputChange(uiOrder, `deck-${uiOrder}`, e.target.value)
            }
            error={
              Boolean(formik.touched[uiOrder]?.[`deck-${uiOrder}`]) &&
              formik.errors[uiOrder]?.[`deck-${uiOrder}`]
            }
          >
            <MenuItem value={0}>Lower deck</MenuItem>
            <MenuItem value={1}>Upper deck</MenuItem>
          </Select>
          <FormHelperText error>
            {formik.touched[uiOrder]?.[`deck-${uiOrder}`] &&
              formik.errors[uiOrder]?.[`deck-${uiOrder}`]}
          </FormHelperText>
        </FormControl>

        <FormControl className="m-3" fullWidth margin="normal">
          <TextField
            id={`seatCost-${uiOrder}`}
            name={`seatCost-${uiOrder}`}
            label="Seat cost"
            variant="outlined"
            value={formik.values[uiOrder]?.[`seatCost-${uiOrder}`]}
            onChange={(e) =>
              handleInputChange(uiOrder, `seatCost-${uiOrder}`, e.target.value)
            }
            error={
              Boolean(formik.touched[uiOrder]?.[`seatCost-${uiOrder}`]) &&
              Boolean(formik.errors[uiOrder]?.[`seatCost-${uiOrder}`])
            }
            helperText={
              formik.touched[uiOrder]?.[`seatCost-${uiOrder}`] &&
              formik.errors[uiOrder]?.[`seatCost-${uiOrder}`]
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CurrencyRupeeIcon />
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
      </FormControl>
    );
  };

  const handleSave = () => {
    if (formik.isValid) {
      localStorage.setItem("seat_data", JSON.stringify(formik.values));
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Seat details have been saved locally. Submit the details to save them permanently.",
      });
    }
  };

  return (
    <div>
      <Card sx={{ width: "55rem", margin: 5, boxShadow: 4 }}>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          noValidate
          className="d-flex flex-column m-3"
        >
          {addSeatList.length > 0 ? (
            <>
              {addSeatList?.map((uiOrder) => (
                <div key={uiOrder}>{singleForm(uiOrder)}</div>
              ))}
              <div className="d-flex flex-row">
                <Button
                  fullWidth
                  variant="outlined"
                  className="m-1"
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  type="submit"
                  disabled={!formik.isValid}
                  fullWidth
                  variant="contained"
                  className="m-1"
                >
                  Submit
                </Button>
              </div>
            </>
          ) : (
            <p>Select a seat for entering data</p>
          )}
        </Box>
      </Card>
    </div>
  );
}
