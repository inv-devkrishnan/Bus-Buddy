import * as yup from "yup";
const passwordRules = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#]).{8,20}$/;
const phoneRules = /^\d+$/;
const nameRules = /^A-Za-z+$/;

export const RegistrationSchema = yup.object().shape({
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
    .min(8)
    .max(20)
    .matches(passwordRules, "Need stronger password")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
  phone: yup
    .string()
    .min(10)
    .matches(phoneRules, "Phone number must be numbers")
    .required("Phone number is required"),
});
