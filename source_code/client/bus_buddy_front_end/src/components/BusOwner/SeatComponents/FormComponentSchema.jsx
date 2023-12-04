import * as yup from "yup";
import { useContext } from "react";
import { AddSeatContext } from "../../../utils/AddSeatContext";

const numberRule = /^\d+$/;

export const FormComponentSchema = () => {
  const { addSeatList } = useContext(AddSeatContext);

  const validationSchema = addSeatList.reduce((acc, uiOrder) => {
    acc[uiOrder] = {
      [`seatNumber-${uiOrder}`]: yup
        .string()
        .required("Seat number is required"),
      [`seatType-${uiOrder}`]: yup.number().required("Seat type is required"),
      [`deck-${uiOrder}`]: yup.number().required("Deck is required"),
      [`seatCost-${uiOrder}`]: yup
        .string()
        .matches(numberRule, "Seat cost must be numbers")
        .required("Seat cost is required"),
    };
    return acc;
  }, {});

  return yup.object().shape(validationSchema);
};
