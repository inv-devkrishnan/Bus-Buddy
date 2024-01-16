import Swal from "sweetalert2";
import { showLoadingAlert } from "../components/common/loading_alert/LoadingAlert"; // Replace "your-file" with the actual path
// Mock SweetAlert2 using sweetalert2-mock
jest.mock("sweetalert2");
const mockFire = jest.fn();
Swal.fire = mockFire;

describe("showLoadingAlert function", () => {
  afterEach(() => {
    // Clear the mock after each test
    mockFire.mockClear();
  });

  it("should call Swal.fire with the correct options", () => {
    const message = "Loading...";
    showLoadingAlert(message);

    // Assert that Swal.fire is called with the correct options
    expect(mockFire).toHaveBeenCalledWith({
      title: message,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      showConfirmButton: false,
      didOpen: expect.any(Function),
    });
  });

  it("should call Swal.showLoading() when the alert is opened", () => {
    showLoadingAlert("Loading...");

    // Call the didOpen callback passed to Swal.fire
    const didOpenCallback = mockFire.mock.calls[0][0].didOpen;
    didOpenCallback();

    // Assert that Swal.showLoading is called
    expect(Swal.showLoading).toHaveBeenCalled();
  });
});
