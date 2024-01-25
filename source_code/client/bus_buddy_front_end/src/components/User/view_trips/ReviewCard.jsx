import { Card, Badge } from "react-bootstrap";
import { StarFill } from "react-bootstrap-icons";
import PropTypes from "prop-types";
function ReviewCard(props) {
  const getBadgeColor = (rate) => {
    switch (rate) {
      case 0:
        return "secondary";
      case 1:
        return "danger";
      case 2:
        return "warning";
      case 3:
        return "primary";
      case 4:
        return "primary";
      case 5:
        return "success";
      default:
        return "dark";
    }
  };
  const getDate = (dateString) => {
    let DateArray = dateString.split("T");
    return DateArray[0];
  };
  return (
    <Card className="w-100 mb-3 mt-3">
      <Card.Body>
        <Card.Title className="mb-3">{props.review.review_title}</Card.Title>
        <p className="d-flex">
          Rating :&nbsp;
          <Badge
            bg={getBadgeColor(props.review.rating)}
            className="d-flex align-items-center"
            style={{ width: "fit-content" }}
          >
            <p style={{ fontSize: "15px" }} className="m-0 p-0">
              {props.review.rating} &nbsp;
            </p>
            <StarFill size="12" />
          </Badge>
        </p>
        <p>{props.review.review_body}</p>
      </Card.Body>
      <Card.Footer className="text-secondary">
        {getDate(props.review?.updated_time) ===
        getDate(props.review?.created_date) ? (
          <>
            Written by {props.review?.user_id?.first_name} on{" "}
            {getDate(props.review?.created_date)}
          </>
        ) : (
          <>
            Updated by {props.review?.user_id?.first_name} on{" "}
            {getDate(props.review?.updated_time)}
          </>
        )}
      </Card.Footer>
    </Card>
  );
}
export default ReviewCard;

ReviewCard.propTypes = {
  review: PropTypes.object,
};
