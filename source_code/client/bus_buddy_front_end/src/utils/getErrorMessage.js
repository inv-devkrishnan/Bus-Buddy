// all error messages related to error codes are stored here
export function getErrorMessage(errorCode) {
  switch (errorCode) {
    case "D1000":
      return "Invalid Login Credentials";
    case "D1001":
      return "User doesn't exist ";
    case "D1002":
      return "Data validation failed";
    case "G1003":
      return "Unauthorized client (google auth)";
    case "G1004":
      return "token expired (google auth)";
    case "G1005":
      return "token invalid (google auth)";
    case "D1004":
      return "Operation not allowed for this user";
    case "D1003":
      return "Old password incorrect";
    case "D1005":
      return "No query param provided";
    case "D1006":
      return "Invalid query param";
    case "D1007":
      return "Email already registered";
    case "D1008":
      return "Phone number already registered";
    case "D1009":
      return "User Banned Permanently";
    case "D1010":
      return "User Account Disabled";
    case "D1011":
      return "Account Not Approved Please Try again Later";
    case "D1012":
      return "The given user is not a bus owner";
    case "D1013":
      return "Operation can't be performed on admin account";
    case "D1014":
      return "Mail Operation Failed ";
    case "D1015":
      return "Please login using different sign in method";
    case "D1016":
      return "Payment Intent Creation Failed";
    case "D1017":
      return "Payment Cancelation Failed";
    case "D1018":
      return "Start date can't be after end date";
    case "D1019":
      return "Responding to complaint failed";
    case "D1020":
      return "Cannot Respond to the complaint that is already responded";
    case "D1021":
      return "Complaint with given id doesn't exising";
    case "D1022":
      return "Cannot Respond to the complaint as the current user";
    case "T0001":
      return "Too many request please try again later";
    default:
      return "Unknown error";
  }
}
export function getCouponErrorMessages(errorCode) {
  switch (errorCode) {
    case "D1023":
      return "Coupon Creation Failed";
    case "D1024":
      return "Coupon Deletion Failed";
    case "D1025":
      return "Coupon DeActivation Failed";
    case "D1026":
      return "Cannot Deactivate Deleted Coupon";
    case "D1027":
      return "Cannot activate Deleted Coupon";
    case "D1028":
      return "Coupon Activation Failed";
    default:
      return getErrorMessage(errorCode);
  }
}
