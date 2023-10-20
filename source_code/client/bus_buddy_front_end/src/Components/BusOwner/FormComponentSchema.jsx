import * as yup from "yup";

export const FormComponentSchema = yup.object().shape({
    seatNumber: yup.string().required("Seat number is required"),
    seatType: yup.number().required("Seat type is required"),
    deck: yup.number().required("Deck is required"),
    seatCost:yup.number().required("Seat cost is required"),
})