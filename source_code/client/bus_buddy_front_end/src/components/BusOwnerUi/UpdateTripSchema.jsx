import * as yup from "yup";

export const UpdateTripSchema = yup.object().shape({
  busName: yup.number().required("Bus is required"),
  routeName: yup.number().required("Route is required"),
  startdate: yup.date().required("Start date is required"),
  enddate: yup.date().required("End date is required"),
  starttime: yup.string().required("starttime is required"),
  endtime: yup.string().required("endtime is required"),
});
