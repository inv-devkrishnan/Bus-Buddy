import { useLocation } from "react-router-dom";
import ShowTrips from "../components/User/view_trips/ShowTrips";
import LandingPage from "./LandingPage";

function SearchTrips() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  return (
    <div>
      <LandingPage
        fromSearchList={true}
        prevStartLocation={queryParams.get("start-name")}
        prevEndLocation={queryParams.get("end-name")}
        prevTripDate={queryParams.get("date")}
      ></LandingPage>
      <ShowTrips
        startLocation={queryParams.get("start")}
        startLocationName={queryParams.get("start-name")}
        endLocationName={queryParams.get("end-name")}
        endLocation={queryParams.get("end")}
        tripDate={queryParams.get("date")}
      ></ShowTrips>
    </div>
  );
}
export default SearchTrips;
