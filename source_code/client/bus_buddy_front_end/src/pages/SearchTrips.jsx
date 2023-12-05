import { useLocation, useNavigate } from "react-router-dom";
import ShowTrips from "../components/User/view_trips/ShowTrips";
import LandingPage from "./LandingPage";
import { useEffect, useMemo, useState } from "react";

function SearchTrips() {
  const location = useLocation();
  const navigate = useNavigate();
  const [paramsValidated, setParamsValidated] = useState(false);
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  useEffect(() => {
    /// code to validate query params
    try {
      let endName = queryParams.get("end-name");
      let startName = queryParams.get("start-name");
      let startLocation = Number(queryParams.get("start"));
      let endLocation = Number(queryParams.get("end"));
      let date = queryParams.get("date");
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (
        endName &&
        startName &&
        startLocation &&
        endLocation &&
        date &&
        dateRegex.test(date)
      ) {
        setParamsValidated(true);
      } else {
        navigate("/not-found", { replace: true }); // if invalid query params provided user is redirectd to not-found page
      }
    } catch (error) {
      navigate("/not-found", { replace: true }); // if invalid query params provided user is redirectd to not-found page
    }
  }, [queryParams, navigate]);

  return (
    <div>
      {paramsValidated && ( // only load the bellow components if params are validated
        <>
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
        </>
      )}
    </div>
  );
}
export default SearchTrips;
