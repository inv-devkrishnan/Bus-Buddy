import { Button, Card } from "react-bootstrap";
import PropTypes from 'prop-types';
import { ArrowRight } from 'react-bootstrap-icons';
function TripCard(props)
{
    return(
        <Card style={{width:"55rem"}} className="p-3 mt-3 mb-3">
          <h3 className="text-primary">{props?.data?.company_name}</h3>
          <h6>{props?.data?.bus_name}</h6> 
          <div className="d-flex justify-content-between ms-5 me-5">
            <div  style={{textAlign:"center"}}>
            <h5>{props?.startLocationName}</h5>
            <h6>{props?.data?.start_location_arrival_time}</h6>
            <p>{props?.data?.start_location_arrival_date}</p>
            </div>
         
            <h5><ArrowRight/></h5>
            <div style={{textAlign:"center"}}>
            <h5>{props?.endLocationName}</h5>
            <h6>{props?.data?.end_location_arrival_time}</h6>
            <p>{props?.data?.start_location_arrival_date}</p>
            </div>
            <h5>Travel Fare : ₹ {props?.data?.travel_fare}</h5>
          </div>
          <div className="w-0 ms-auto">
          <Button className="me-5">View Amenities</Button>   
          <Button className="">View Seats</Button> 
          </div>
         
        </Card>
    )
}
TripCard.propTypes = {
    data: PropTypes.object,
    startLocationName: PropTypes.string,
    endLocationName: PropTypes.string,
  };
export default TripCard;