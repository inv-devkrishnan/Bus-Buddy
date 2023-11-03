import { useEffect } from "react";
import { openAxiosApi } from "../../../utils/axiosApi";

function ShowTrips(props) {
  useEffect(() => {
    getTrips(props);
  }, [props]);

  const getTrips = async (value) => {
    
    await openAxiosApi
      .get(
        `user/view-trips/?start=${value?.startLocation}&end=${value?.endLocation}&date=${value.tripDate}&page=1`
      )
      .then((result) => {
        console.log(result.data);
      });
  };
  return (
    <div className="d-flex justify-content-center">
      <h2>trips</h2>
    </div>
  );
}
export default ShowTrips;
