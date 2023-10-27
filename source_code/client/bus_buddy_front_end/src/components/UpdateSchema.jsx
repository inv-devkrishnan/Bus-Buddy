import * as yup from "yup";
const phoneRules = /^\d+$/;
const nameRules = /^[A-Za-z]+$/;

export const UpdateSchema = yup.object().shape({
  firstName: yup
    .string()
    .matches(nameRules, "Name must be letters")
    .required("First name is required"),
  lastName: yup
    .string()
    .matches(nameRules, "Name must be letters")
    .required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .min(10)
    .matches(phoneRules, "Phone number must be numbers")
    .required("Phone number is required"),
});