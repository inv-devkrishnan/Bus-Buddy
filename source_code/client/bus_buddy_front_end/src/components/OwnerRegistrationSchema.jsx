import * as yup from "yup";
const onlyNumberRule = /^\d+$/;
const chargeRule = /^\d+(\.\d+)?$/;
const nameRules = /^[A-Za-z]+$/;
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const OwnerRegistrationSchema = yup.object().shape({
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
    .matches(onlyNumberRule, "Phone number must be numbers")
    .required("Phone number is required"),
  companyName: yup.string().trim().required("Company name is required"),
  aadhaar: yup
    .string()
    .min(12)
    .matches(/^\S*$/, "Spaces are not allowed")
    .matches(onlyNumberRule, "Aadhaar number must be numbers")
    .required("Aadhaar number is required"),
  msme: yup
    .string()
    .trim()
    .matches(/^(UDYAM|Udyam)-[A-Za-z]{2}-\d{2}-\d{7}$/, "Invalid udyam number")
    .required("MSME number is required"),
  extraCharges: yup
    .string()
    .matches(chargeRule, "GST must be a valid number")
    .required("GST is required"),
});
