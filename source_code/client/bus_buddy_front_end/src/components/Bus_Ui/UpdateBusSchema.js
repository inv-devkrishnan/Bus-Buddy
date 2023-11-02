import * as yup from "yup";
const nameRules = /^[A-Za-z]+$/;

export const UpdateBusSchema = yup.object().shape({
  busName: yup
    .string()
    .matches(nameRules, "Name must be letters")
    .required("First name is required"),
  id: yup
    .string()
    .required("Last name is required"),
  plateno: yup.string().min(10).max(10).required(),
  bustype: yup
    .string()
    .required("Phone number is required"),
  busac: yup.string().required("Email is required"),
  busseattype: yup.string().required("Email is required"),
});