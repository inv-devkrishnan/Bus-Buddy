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
    currentSeatData,
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
        [`seatNumber`]: "",
        [`seatType`]: 0,
        [`deck`]: 0,
        [`seatCost`]: "",
      };
      return acc;
    }, {}),
    validationSchema,
    onSubmit,
  });
  console.log(addSeatList);
  console.log(formik.values[33]);

  const handleInputChange = (uiOrder, field, value) => {
    // for saving data dynamically using formik eith on change property
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
            id={`seatNumber`}
            name={`seatNumber`}
            label="Seat number"
            variant="outlined"
            value={formik.values[uiOrder]?.[`seatNumber`]}
            onChange={(e) =>
              handleInputChange(uiOrder, `seatNumber`, e.target.value)
            }
            error={
              formik.touched[uiOrder]?.[`seatNumber`] &&
              formik.errors[uiOrder]?.[`seatNumber`]
            }
            helperText={
              formik.touched[uiOrder]?.[`seatNumber`] &&
              formik.errors[uiOrder]?.[`seatNumber`]
            }
          />
        </FormControl>

        <FormControl className="m-3" fullWidth margin="normal">
          <InputLabel htmlFor="seatType">Seat type</InputLabel>
          <Select
            id={`seatType`}
            name={`seatType`}
            label="Seat type"
            variant="outlined"
            value={formik.values[uiOrder]?.[`seatType`] || 0}
            onChange={(e) =>
              handleInputChange(uiOrder, `seatType`, e.target.value)
            }
            error={
              formik.touched[uiOrder]?.[`seatType`] &&
              Boolean(formik.errors[uiOrder]?.[`seatType`])
            }
          >
            <MenuItem value={0}>Seater</MenuItem>
            <MenuItem value={1}>Sleeper</MenuItem>
          </Select>
          <FormHelperText error>
            {formik.touched[uiOrder]?.[`seatType`] &&
              formik.errors[uiOrder]?.[`seatType`]}
          </FormHelperText>
        </FormControl>

        <FormControl className="m-3" fullWidth margin="normal">
          <InputLabel htmlFor="seatType">Deck</InputLabel>
          <Select
            id={`deck`}
            name={`deck`}
            label="Deck"
            variant="outlined"
            value={formik.values[uiOrder]?.[`deck`] || 0}
            onChange={(e) => handleInputChange(uiOrder, `deck`, e.target.value)}
            error={
              formik.touched[uiOrder]?.[`deck`] &&
              Boolean(formik.errors[uiOrder]?.[`deck`])
            }
          >
            <MenuItem value={0}>Lower deck</MenuItem>
            <MenuItem value={1}>Upper deck</MenuItem>
          </Select>
          <FormHelperText error>
            {formik.touched[uiOrder]?.[`deck`] &&
              formik.errors[uiOrder]?.[`deck`]}
          </FormHelperText>
        </FormControl>

        <FormControl className="m-3" fullWidth margin="normal">
          <TextField
            id={`seatCost`}
            name={`seatCost`}
            label="Seat cost"
            variant="outlined"
            value={formik.values[uiOrder]?.[`seatCost`]}
            onChange={(e) =>
              handleInputChange(uiOrder, `seatCost`, e.target.value)
            }
            error={
              formik.touched[uiOrder]?.[`seatCost`] &&
              formik.errors[uiOrder]?.[`seatCost`]
            }
            helperText={
              formik.touched[uiOrder]?.[`seatCost`] &&
              formik.errors[uiOrder]?.[`seatCost`]
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

              <Button
                type="submit"
                disabled={!formik.isValid}
                fullWidth
                variant="contained"
              >
                Submit
              </Button>
            </>
          ) : (
            <p>Select a seat for entering data</p>
          )}
        </Box>
      </Card>
    </div>
  );
}
