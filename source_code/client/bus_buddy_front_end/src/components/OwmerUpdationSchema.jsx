import * as yup from "yup";
const onlyNumberRule = /^\d+$/;
const nameRules = /^[A-Za-z_ .]+$/;

export const OwnerUpdationSchema = yup.object().shape({
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
    .matches(onlyNumberRule, "Phone number must be numbers")
    .required("Phone number is required"),
  companyName: yup.string().required("Company Name is required"),
});