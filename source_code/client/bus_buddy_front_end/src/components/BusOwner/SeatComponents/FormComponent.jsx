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
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useFormik,
  Formik,
  Field,
  FieldArray,
  ErrorMessage,
  Form,
  getIn,
} from "formik";
import Swal from "sweetalert2";
import * as yup from "yup";

import "./FormComponent.css";
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
    updateAddSeatList,
  } = useContext(AddSeatContext); // use context holds ui order,current data and for storing current data
  const [formData, setFormData] = useState([]);

  const validationSchema = yup.object().shape({
    seat: yup.array().of(
      yup.object().shape({
        seatNumber: yup
          .string()
          .matches(/^[a-zA-Z0-9]+$/, "Invalid seat number")
          .required("Seat number is required"),
        seatType: yup.number().required("Seat type is required"),
        deck: yup.number().required("Deck is required"),
        seatCost: yup
          .string()
          .matches(/^\d+$/, "Seat cost must be numbers")
          .required("Seat cost is required"),
      })
    ),
  });

  const onSubmit = (values) => {
    // api call for storing seat details
    console.log(values);
  };

  const initialValues = {
    seat: addSeatList.map((seat) => ({
      seatNumber: "",
      seatType: "",
      deck: "",
      seatCost: "",
    })),
  };

  return (
    <Card className="card-display">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form>
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
                          id={`seat[${index}].seatNumber`}
                          name={`seat[${index}].seatNumber`}
                        />
                        <ErrorMessage
                          name={`seat[${index}].seatNumber`}
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
                          id={`seat[${index}].seatType`}
                          name={`seat[${index}].seatType`}
                        >
                          <MenuItem value={0}>Seater</MenuItem>
                          <MenuItem value={1}>Sleeper</MenuItem>
                        </Field>
                        <ErrorMessage
                          name={`seat[${index}].seatType`}
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
                          <MenuItem value={0}>Lower deck</MenuItem>
                          <MenuItem value={1}>Upper Deck</MenuItem>
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
                          id={`seat[${index}].seatCost`}
                          name={`seat[${index}].seatCost`}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <CurrencyRupeeIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                        <ErrorMessage
                          name={`seat[${index}].seatCost`}
                          component={FormHelperText}
                          error
                        />
                      </FormControl>
                      {addSeatList.length > 1 && (
                        <Button
                          onClick={() => {
                            arrayProps.remove(index);
                            const updatedList = addSeatList.filter(
                              (seatId) => seatId !== seat
                            );
                            updateAddSeatList(updatedList);
                          }}
                        >
                          <DeleteIcon color="error" />
                        </Button>
                      )}
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
