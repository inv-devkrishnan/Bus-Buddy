import { React, useState, useContext } from "react";
import {
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Button,
  Card,
  FormHelperText,
} from "@mui/material";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import DeleteIcon from "@mui/icons-material/Delete";
import { Formik, Field, FieldArray, ErrorMessage, Form } from "formik";
import Swal from "sweetalert2";
import * as yup from "yup";

import "./FormComponent.css";
import { AddSeatContext } from "../../../utils/AddSeatContext";
import { axiosApi } from "../../../utils/axiosApi";

export default function FormComponent(props) {
  console.log(props);
  const {
    addSeatList,
    updateAddSeatList,
    reRender,
    updateReRender,
    reInitialize,
    updateReInitialize,
  } = useContext(AddSeatContext); // use context holds ui order,current data and for storing current data

  const validationSchema = yup.object().shape({
    seat: yup.array().of(
      yup.object().shape({
        seat_number: yup
          .string()
          .matches(/^[a-zA-Z0-9]+$/, "Only letters and numbers are allowed")
          .required("Seat number is required"),
        seat_type: yup.number().required("Seat type is required"),
        deck: yup.number().required("Deck is required"),
        seat_cost: yup
          .string()
          .matches(/^\d+$/, "Seat cost must be numbers")
          .required("Seat cost is required"),
      })
    ),
  });

  const onSubmit = (values) => {
    // api call for storing seat details
    console.log(values.seat);
    axiosApi
      .post(`bus-owner/add-seat-details?bus=${props.bus}`, values.seat)
      .then((res) => {
        const messages = res.data?.message;

        if (messages) {
          const combinedMessage = Object.keys(messages)
            .map((key) => messages[key])
            .join("\n");

          Swal.fire({
            icon: "info",
            title: "Info",
            text: combinedMessage,
          });
        } else {
          console.log(messages);
        }
        updateAddSeatList([]);
        updateReRender(!reRender);
      })
      .catch((err) => {
        console.log(err.response);
        Swal.fire({
          icon: "error",
          title: "Oops..",
          text: "Something went wrong!",
        });
      });
  };

  const seatTypeMenu = (type) => {
    if (type === 1) {
      return [
        <MenuItem key={1} value={1}>
          Sleeper
        </MenuItem>,
      ];
    } else if (type === 0) {
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

  const deckMenu = (propsData) => {
    const floorValue = Math.floor(propsData / 10);
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

  const initialValues = {
    seat: addSeatList.map((seat) => ({
      seat_ui_order: seat,
      seat_number: "",
      seat_type: "",
      deck: "",
      seat_cost: "",
    })),
  };

  return (
    <Card className="card-display">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize={reInitialize}
      >
        <Form className="m-3">
          <FieldArray name="seat">
            {(arrayProps) => {
              return (
                <div>
                  {addSeatList?.map((seat, index) => (
                    <FormControl
                      key={seat}
                      className="d-flex flex-column flex-lg-row"
                    >
                      <span className="m-2">id:{seat}</span>
                      <FormControl className="m-2">
                        <Field
                          as={TextField}
                          label="Seat Number"
                          variant="outlined"
                          id={`seat[${index}].seat_number`}
                          name={`seat[${index}].seat_number`}
                        />
                        <ErrorMessage
                          name={`seat[${index}].seat_number`}
                          component={FormHelperText}
                          error
                        />
                      </FormControl>
                      <FormControl className="m-2">
                        <InputLabel htmlFor={`seatType`}>Seat type</InputLabel>
                        <Field
                          as={Select}
                          label="Seat type"
                          variant="outlined"
                          id={`seat[${index}].seat_type`}
                          name={`seat[${index}].seat_type`}
                        >
                          {seatTypeMenu(props.seatType)}
                        </Field>
                        <ErrorMessage
                          name={`seat[${index}].seat_type`}
                          component={FormHelperText}
                          error
                        />
                      </FormControl>
                      <FormControl className="m-2">
                        <InputLabel htmlFor={`deck`}>Deck</InputLabel>
                        <Field
                          as={Select}
                          label="Deck"
                          variant="outlined"
                          id={`seat[${index}].deck`}
                          name={`seat[${index}].deck`}
                        >
                          {deckMenu(seat)}
                        </Field>
                        <ErrorMessage
                          name={`seat[${index}].deck`}
                          component={FormHelperText}
                          error
                        />
                      </FormControl>
                      <FormControl className="m-2">
                        <Field
                          as={TextField}
                          label="Seat Cost"
                          variant="outlined"
                          id={`seat[${index}].seat_cost`}
                          name={`seat[${index}].seat_cost`}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <CurrencyRupeeIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                        <ErrorMessage
                          name={`seat[${index}].seat_cost`}
                          component={FormHelperText}
                          error
                        />
                      </FormControl>
                      <div className="d-flex justify-content-center align-items-start">
                        {addSeatList.length > 1 && (
                          <Button
                            onClick={() => {
                              arrayProps.remove(index);
                              const updatedList = addSeatList.filter(
                                (seatId) => seatId !== seat
                              );
                              updateAddSeatList(updatedList);
                              updateReInitialize(false);
                            }}
                          >
                            <DeleteIcon color="error" />
                          </Button>
                        )}
                      </div>
                    </FormControl>
                  ))}
                </div>
              );
            }}
          </FieldArray>
          <Button variant="contained" type="submit" fullWidth>
            Submit
          </Button>
        </Form>
      </Formik>
    </Card>
  );
}
