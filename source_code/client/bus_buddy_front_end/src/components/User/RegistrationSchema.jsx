import * as yup from "yup";
const phoneRules = /^\d+$/;
const nameRules = /^[A-Za-z]+$/;
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const RegistrationSchema = yup.object().shape({
  first_name: yup
    .string()
    .matches(nameRules, "Name must be letters")
    .required("First name is required"),
  last_name: yup
    .string()
    .matches(nameRules, "Name must be letters")
    .required("Last name is required"),
  email: yup
    .string()
    .matches(/^\S*$/, "Spaces are not allowed")
    .matches(emailRegex, "Invalid email address")
    .email("Invalid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must be at most 20 characters")
    .matches(/^(?=.*[A-Z])/, "At least one capital letter is required")
    .matches(/^(?=.*[a-z])/, "At least one small letter is required")
    .matches(/^(?=.*\d)/, "At least one number is required")
    .matches(
      /^(?=.*[!@#$%^&*()\-_=+{};:,<.>])/,
      "At least one special character is required"
    )
    .matches(/^\S*$/, "Spaces are not allowed")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
  phone: yup
    .string()
    .min(10)
    .matches(/^\S*$/, "Spaces are not allowed")
    .matches(phoneRules, "Phone number must be numbers")
    .required("Phone number is required"),
});
