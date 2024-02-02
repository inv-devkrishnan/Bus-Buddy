import * as yup from "yup";
const numberRule = /^\d+$/;
const alphanum = /^[a-zA-Z\d]+$/;

export const FormComponentSchema = yup.object().shape({
  // form validation for formik
  seatNumber: yup
    .string()
    .matches(alphanum, "The seat number may only include letters and numbers.")
    .required("Seat number is required"),
  seatType: yup.number().required("Seat type is required"),
  deck: yup.number().required("Deck is required"),
  seatCost: yup
    .string()
    .matches(numberRule, "Seat cost must be numbers")
    .required("Seat cost is required"),
});
