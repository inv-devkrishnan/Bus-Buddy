import * as yup from "yup";
const nameRules = /^[A-Za-z0-9]+$/;

export const UpdateBusSchema = yup.object().shape({
  busName: yup
    .string()
    .matches(nameRules, "Name must be letters and numbers")
    .required("name is required"),
  plateno: yup.string().min(9).max(10).required(),
  bustype: yup
    .string()
    .required("Phone number is required"),
  busac: yup.string().required("Email is required"),
  busseattype: yup.string().required("Email is required"),
});