import * as yup from "yup";
const busNameRules = /^[A-Za-z0-9 ():',.]+$/;
const platenoRules = /^[A-Za-z0-9]+$/;

export const UpdateBusSchema = yup.object().shape({
  busName: yup
    .string()
    .matches(
      busNameRules,
      "Only letters , Numbers , `:`,`()` are allowed"
    )
    .required("name is required"),
  plateno: yup
    .string()
    .matches(platenoRules, "Plate No can only have numbers and letters")
    .min(9, "Plate Number should have atleast 9 characters")
    .max(10, "Plate Number can only have atmost 10 characters")
    .required("plateno is required"),
  bustype: yup.string().required("required"),
  busac: yup.string().required(" required"),
  busseattype: yup.string().required("required"),
});
