// all error messages related to error codes are stored here
export function getErrorMessage(errorCode)
{
    switch (errorCode) {
        case "D1000":
          return("Invalid Login Credentials");
        case "D1001":
          return(
            "User doesn't exist ");
        case "D1002":
          return("Data validation failed");
        case "G1003":
          return("Unauthorized client (google auth)");
        case "G1004":
          return("token expired (google auth)");
        case "G1005":
          return("token invalid (google auth)");
        default:
          return("Unknown error");
    }
}