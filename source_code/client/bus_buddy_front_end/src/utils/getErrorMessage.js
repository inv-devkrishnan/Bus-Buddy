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
    default:
      return "Unknown error";
  }
}
