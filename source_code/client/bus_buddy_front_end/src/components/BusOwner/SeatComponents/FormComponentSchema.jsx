import * as yup from "yup";
const numberRule = /^[1-9].+$/;
const alphanum = /^[a-zA-Z\d]+$/;
const maxCost = /^\d{1,4}(\.\d{1,2})?$/;

export const FormComponentSchema = yup.object().shape({
  // form validation for formik
  seatNumber: yup
    .string()
    .matches(
      alphanum,
      "The seat number should consist only of letters and numbers."
    )
    .required("Seat number is required"),
  seatType: yup.number().required("Seat type is required"),
  deck: yup.number().required("Deck is required"),
  seatCost: yup
    .string()
    .notOneOf(["0", "0.0", "0.00"], "Cost cannot zero")
    .matches(
      numberRule,
      "Seat cost must be numbers. If only decimal places are necessary, please use zero before the decimal point."
    )
    .matches(
      maxCost,
      "Up to 4 digits before the decimal point and up to 2 digits after the decimal point"
    )
    .required("Seat cost is required"),
});
