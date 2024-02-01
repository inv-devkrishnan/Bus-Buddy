// errorMessages.test.js
import {
  getErrorMessage,
  getLoginErrorMessages,
  getPaymentErrorMessages,
  getCouponErrorMessages,
  getComplaintErrorMessages,
  getForgotPasswordErrorMessages,
} from "../utils/getErrorMessage";

describe("Error Messages", () => {
  describe("getErrorMessage", () => {

    it("returns correct error message for D0001", () => {
      expect(getErrorMessage("D1001")).toBe("User doesn't exist ");
    });
    it("returns correct error message for known error code", () => {
      expect(getErrorMessage("D1002")).toBe("Data validation failed");
    });
    it("returns correct error message for D1003", () => {
      expect(getErrorMessage("D1003")).toBe("Old password incorrect");
    });
    it("returns correct error message for D1004", () => {
      expect(getErrorMessage("D1004")).toBe(
        "Operation not allowed for this user"
      );
    });

    it("returns correct error message for D1005", () => {
      expect(getErrorMessage("D1005")).toBe("No query param provided");
    });
    it("returns correct error message for D1006", () => {
      expect(getErrorMessage("D1006")).toBe("Invalid query param");
    });
    it("returns correct error message for D1007", () => {
      expect(getErrorMessage("D1007")).toBe("Email already registered");
    });

    it("returns correct error message for D1008", () => {
      expect(getErrorMessage("D1008")).toBe("Phone number already registered");
    });

    it("returns correct error message for D1012", () => {
      expect(getErrorMessage("D1012")).toBe(
        "The given user is not a bus owner"
      );
    });

    it("returns correct error message for D1013", () => {
      expect(getErrorMessage("D1013")).toBe(
        "Operation can't be performed on admin account"
      );
    });

    it("returns correct error message for D1014", () => {
      expect(getErrorMessage("D1014")).toBe("Mail Operation Failed ");
    });

    it("returns correct error message for D1029", () => {
      expect(getErrorMessage("D1029")).toBe("Database Error");
    });
    it("returns correct error message for T0001", () => {
      expect(getErrorMessage("T0001")).toBe(
        "Too many request please try again later"
      );
    });
    it("returns default message for unknown error code", () => {
      expect(getErrorMessage("UNKNOWN_ERROR_CODE")).toBe("Unknown error");
    });
  });

  describe("getLoginErrorMessages", () => {
    it("returns correct login error message for known error code", () => {
      expect(getLoginErrorMessages("D1000")).toBe("Invalid Login Credentials");
    });
    it("returns correct error message for G1003", () => {
      expect(getLoginErrorMessages("G1003")).toBe(
        "Unauthorized client (google auth)"
      );
    });

    it("returns correct error message for G1004", () => {
      expect(getLoginErrorMessages("G1004")).toBe(
        "token expired (google auth)"
      );
    });

    it("returns correct error message for G1005", () => {
      expect(getLoginErrorMessages("G1005")).toBe(
        "token invalid (google auth)"
      );
    });

    it("returns2 correct error1", () => {
      expect(getLoginErrorMessages("D1009")).toBe("User Banned Permanently");
      expect(getLoginErrorMessages("D1010")).toBe("User Account Disabled");
      expect(getLoginErrorMessages("D1015")).toBe(
        "Please login using different sign in method"
      );
      expect(getLoginErrorMessages("D1011")).toBe(
        "Account Not Approved Please Try again Later"
      );
      expect(getLoginErrorMessages("UNKNOWN_ERROR_CODE")).toBe("Unknown error");
    });
  });

  describe("getPaymentErrorMessages", () => {
    it("returns correct payment error message for known error code", () => {
      expect(getPaymentErrorMessages("D1016")).toBe(
        "Payment Intent Creation Failed"
      );
    });

    it("returns correct error message for D1017", () => {
      expect(getPaymentErrorMessages("D1017")).toBe(
        "Payment Cancelation Failed"
      );
    });

    it("returns default message for unknown payment error code", () => {
      expect(getPaymentErrorMessages("UNKNOWN_ERROR_CODE")).toBe(
        "Unknown error"
      );
    });
  });

  describe("getCouponErrorMessages", () => {
    it("returns correct coupon error message for known error code", () => {
      expect(getCouponErrorMessages("D1023")).toBe("Coupon Creation Failed");
    });

    it("returns correct error message for D1024", () => {
      expect(getCouponErrorMessages("D1024")).toBe("Coupon Deletion Failed");
    });

    it("returns correct error message for D1025", () => {
      expect(getCouponErrorMessages("D1025")).toBe(
        "Coupon DeActivation Failed"
      );
    });

    it("returns correct error message for D1026", () => {
      expect(getCouponErrorMessages("D1026")).toBe(
        "Cannot Deactivate Deleted Coupon"
      );
    });

    it("returns correct error message for D1027", () => {
      expect(getCouponErrorMessages("D1027")).toBe(
        "Cannot activate Deleted Coupon"
      );
    });

    it("returns correct error message for D1028", () => {
      expect(getCouponErrorMessages("D1028")).toBe("Coupon Activation Failed");
    });

    it("returns default message for unknown coupon error code", () => {
      expect(getCouponErrorMessages("UNKNOWN_ERROR_CODE")).toBe(
        "Unknown error"
      );
    });
  });

  describe("getComplaintErrorMessages", () => {
    it("returns correct complaint error message for known error code", () => {
      expect(getComplaintErrorMessages("D1018")).toBe(
        "Start date can't be after end date"
      );
      expect(getComplaintErrorMessages("D1019")).toBe(
        "Responding to complaint failed"
      );
      expect(getComplaintErrorMessages("D1020")).toBe(
        "Cannot Respond to the complaint that is already responded"
      );
      expect(getComplaintErrorMessages("D1021")).toBe(
        "Complaint with given id doesn't existing"
      );
      expect(getComplaintErrorMessages("D1022")).toBe(
        "Cannot Respond to the complaint as the current user"
      );
      expect(getComplaintErrorMessages("UNKNOWN_ERROR_CODE")).toBe(
        "Unknown error"
      );
    });
  });

  describe("getforgotPasswordErrorMessagees", () => {
    it("Email not Registered or Banned", () => {
      expect(getForgotPasswordErrorMessages("D1030")).toBe(
        "Operation not applicable for google sign in or other 3rd party sign in users"
      );
      expect(getForgotPasswordErrorMessages("D1031")).toBe(
        "Forgot password email sent failed"
      );
      expect(getForgotPasswordErrorMessages("D1032")).toBe(
        "Current Session is invalid or expired please try again"
      );
      expect(getForgotPasswordErrorMessages("D1033")).toBe(
        "Operation only applicable for active accounts"
      );
      expect(getForgotPasswordErrorMessages("UNKNOWN_ERROR_CODE")).toBe(
        "Unknown error"
      );
    });
  });

  
});
