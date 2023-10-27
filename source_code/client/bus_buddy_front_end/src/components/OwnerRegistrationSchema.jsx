import * as yup from "yup";
const onlyNumberRule = /^\d+$/;
const nameRules = /^[A-Za-z]+$/;

export const OwnerRegistrationSchema = yup.object().shape({
  firstName: yup
    .string()
    .matches(nameRules, "Name must be letters")
    .required("First name is required"),
  lastName: yup
    .string()
    .matches(nameRules, "Name must be letters")
    .required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(20, "Password must be at most 20 characters")
  .matches(/^(?=.*[A-Z])/, "At least one capital letter is required")
  .matches(/^(?=.*[a-z])/, "At least one small letter is required")
  .matches(/^(?=.*\d)/, "At least one number is required")
  .matches(/^(?=.*[!@#$%^&*()_+])/, "At least one special character is required")
  .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
  phone: yup
    .string()
    .min(10)
    .matches(onlyNumberRule, "Phone number must be numbers")
    .required("Phone number is required"),
  companyName: yup.string().required(),
  aadhaar: yup
    .string()
    .min(12)
    .matches(onlyNumberRule, "Aadhaar number must be numbers")
    .required("Aadhaar number is required"),
  msme: yup.string().required("MSME number is required"),
  extraCharges: yup
    .string()
    .matches(onlyNumberRule, "Extra charges must be numbers")
    .required("Extra Charges is required"),
});
