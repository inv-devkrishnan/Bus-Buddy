import * as yup from "yup";
const numberRule = /^\d+$/;

export const FormComponentSchema = yup.object().shape({
    // form validation for formik
    seatNumber: yup.string().required("Seat number is required"),
    seatType: yup.number().required("Seat type is required"),
    deck: yup.number().required("Deck is required"),
    seatCost:yup.string().matches(numberRule,"Seat cost must be numbers").required("Seat cost is required"),
})