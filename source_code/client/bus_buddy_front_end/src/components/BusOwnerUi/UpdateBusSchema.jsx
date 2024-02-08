import * as yup from "yup";
const busNameRules = /^[A-Za-z0-9 ():',.]+$/;
const platenoRules = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/;

export const UpdateBusSchema = yup.object().shape({
  busName: yup
    .string()
    .max(100, "Name should have at most 100 characters")
    .transform((originalValue) => originalValue.trim())
    .matches(
      busNameRules,
      "Only letters , Numbers , `:`,`()` are allowed,No blank field is allowed"
    )
    .required("name is required"),
  plateno: yup
    .string()
    .matches(platenoRules, "Plate number should and can only have numbers and letters")
    .min(9, "Plate Number should have atleast 9 characters")
    .max(10, "Plate Number can only have atmost 10 characters")
    .required("plate number is required"),
  bustype: yup.string().required("required"),
  busac: yup.string().required(" required"),
  busseattype: yup.string().required("required"),
});
