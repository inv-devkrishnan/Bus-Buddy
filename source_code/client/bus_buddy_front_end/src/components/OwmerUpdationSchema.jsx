import * as yup from "yup";
const onlyNumberRule = /^\d+$/;
const nameRules = /^[A-Za-z]+$/;
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const OwnerUpdationSchema = yup.object().shape({
  firstName: yup
    .string()
    .matches(nameRules, "Name must be letters")
    .required("First name is required"),
  lastName: yup
    .string()
    .matches(nameRules, "Name must be letters")
    .required("Last name is required"),
  email: yup
    .string()
    .matches(/^\S*$/, "Spaces are not allowed")
    .matches(emailRegex, "Invalid email address")
    .email("Invalid email")
    .required("Email is required"),
  phone: yup
    .string()
    .min(10)
    .matches(/^\S*$/, "Spaces are not allowed")
    .matches(onlyNumberRule, "Phone number must be numbers")
    .required("Phone number is required"),
  companyName: yup.string().trim().required("Company Name is required"),
});
