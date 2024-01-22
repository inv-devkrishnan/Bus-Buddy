import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { axiosApi } from "../../../utils/axiosApi";
import Swal from "sweetalert2";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { showLoadingAlert } from "../../common/loading_alert/LoadingAlert";
import { getCouponErrorMessages } from "../../../utils/getErrorMessage";

function CreateCoupon() {
  const {
    register,
    handleSubmit,
    trigger,
    unregister,
    control,
    formState: { errors },
  } = useForm();

  const [availability, setAvailability] = useState(0); // state variable to store the value of availability option
  const [busOwnerList, setBusOwnerList] = useState([]); // to store bus owner list
  const [tripList, setTripList] = useState([]); // to store trip list
  const navigate = useNavigate();

  const get_bus_owner_list = async () => {
    // function to get bus owner list
    let BusDataList = [];
    await axiosApi
      .get("adminstrator/create-coupon/?status=0")
      .then((result) => {
        if (result.data?.error_code) {
          console.log(result.data);
        } else {
          // eslint-disable-next-line array-callback-return
          result.data.map((bus) => {
            let busData = {
              value: bus.id,
              label: bus?.first_name + " from " + bus?.company_name,
            };
            BusDataList.push(busData);
          });
          setBusOwnerList(BusDataList);
        }
      });
  };

  const get_trip_list = async () => {
    // function to get triplist
    let tripDataList = [];
    await axiosApi
      .get("adminstrator/create-coupon/?status=1")
      .then((result) => {
        if (result.data?.error_code) {
          console.log(result.data);
        } else {
          // eslint-disable-next-line array-callback-return
          result.data.map((trip) => {
            let tripData = {
              value: trip.id,
              label:
                trip?.route?.start_point?.location_name +
                " to " +
                trip?.route?.end_point?.location_name +
                " on " +
                trip?.start_date +
                "  by " +
                trip?.user?.company_name,
            };
            tripDataList.push(tripData);
          });
          setTripList(tripDataList);
        }
      });
  };

  const submitData = (data) => {
    // function to create coupon
    showLoadingAlert("Creating Coupon");
    console.log(data)
    axiosApi
      .post("adminstrator/create-coupon/", data)
      .then((result) => {
        Swal.close();
        if (result.data?.error_code) {
          Swal.fire({
            title: "Task Failed",
            text: getCouponErrorMessages(result.data?.error_code),
            icon: "error",
          });
        } else if (result.data?.success_code) {
          Swal.fire({
            title: "Coupon Created",
            icon: "success",
          });
          navigate("/admin-dashboard/show-coupon", { replace: true });
        }
      })
      .catch(function (error) {
        Swal.close();
        Swal.fire({
          title: "Task Failed",
          text: getCouponErrorMessages(error?.response?.data?.error_code),
          icon: "error",
        });
      });
  };
  return (
    <Container style={{ height: "90vh" }}>
      <Row>
        <Col className="mt-3">
          <h1>Create New Coupon</h1>
        </Col>
      </Row>
      <Form className="mt-5" onSubmit={handleSubmit(submitData)}>
        <Row>
          <Form.Group as={Col} md="6" lg="6" xl="5" xxl="4">
            <Form.Label>Coupon Name</Form.Label>
            <Form.Control
              type="text"
              maxLength={80}
              placeholder="Coupon Name (maximum 80 characters)"
              name="coupon_name"
              {...register("coupon_name", { required: true, maxLength: 80 })}
              onBlur={() => {
                trigger("coupon_name");
              }}
            />
            {errors.coupon_name && errors.coupon_name.type === "required" && (
              <p className="text-danger mt-2"> * Coupon name required</p>
            )}
            {errors.coupon_name && errors.coupon_name.type === "maxLength" && (
              <p className="text-danger mt-2"> Maximum allowed 80 characters</p>
            )}
          </Form.Group>
          <Form.Group as={Col} md="6" lg="6" xl="5" xxl="4">
            <Form.Label>Coupon Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={1}
              name="coupon_desc"
              maxLength={500}
              placeholder="Coupon Description (maximum 500 characters)"
              {...register("coupon_description", {
                required: true,
                maxLength: 500,
              })}
              onBlur={() => {
                trigger("coupon_description");
              }}
            />
            {errors.coupon_description &&
              errors.coupon_description.type === "required" && (
                <p className="text-danger mt-2">
                  {" "}
                  * Coupon Description required
                </p>
              )}
            {errors.coupon_description &&
              errors.coupon_description.type === "maxLength" && (
                <p className="text-danger mt-2">
                  {" "}
                  Maximum allowed 500 characters
                </p>
              )}
          </Form.Group>
          <Form.Group as={Col} md="6" lg="6" xl="5" xxl="3">
            <Form.Label>Coupon Eligibility</Form.Label>
            <Form.Select
              aria-label="Default select example"
              name="coupon_eligibility"
              {...register("coupon_eligibility", {
                required: true,
                valueAsNumber: true,
              })}
            >
              <option value={0}>Everyone</option>
              <option value={1}>New Customers (First Booking)</option>
            </Form.Select>
          </Form.Group>
        </Row>
        <Row className="mt-3">
          <Form.Group as={Col} md="6" lg="6" xl="4">
            <Form.Label>Coupon Availability</Form.Label>
            <Form.Select
              data-testid="coupon-availability"
              {...register("coupon_availability", {
                required: true,
                valueAsNumber: true,
              })}
              onChange={(e) => {
                switch (Number(e.target.value)) {
                  case 1:
                    get_bus_owner_list();
                    unregister("trip");
                    break;
                  case 2:
                    get_trip_list();
                    unregister("user");
                    break;
                  default:
                    unregister("user");
                    unregister("trip");
                }
                setAvailability(e.target.value);
              }}
              value={availability}
            >
              <option value={0}>To all trips </option>
              <option value={1}>To trips of a specifc bus owner</option>
              <option value={2}>To a particular trip</option>
            </Form.Select>
          </Form.Group>
          {Number(availability) === 1 && (
            <Form.Group as={Col} md="6" lg="6" xl="5" xxl="4">
              <Form.Label>Select Bus Owner</Form.Label>
              <Controller
                name="user"
                control={control}
                rules={{ required: "Select a valid bus owner" }}
                render={({ field }) => (
                  <>
                    <Select
                      {...field}
                      value={busOwnerList.find(
                        (option) => option.value === field.value
                      )}
                      options={busOwnerList}
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption.value)
                      }
                    ></Select>
                    {errors.user && (
                      <p className="text-danger mt-2">{errors.user.message}</p>
                    )}
                  </>
                )}
              ></Controller>
            </Form.Group>
          )}
          {Number(availability) === 2 && (
            <Form.Group as={Col} md="6" lg="6" xl="5" xxl="5">
              <Form.Label>Select Trip</Form.Label>
              <Controller
                name="trip"
                control={control}
                rules={{ required: "Select a valid trip" }}
                render={({ field }) => (
                  <>
                    <Select
                      {...field}
                      value={tripList.find(
                        (option) => option.value === field.value
                      )}
                      options={tripList}
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption.value)
                      }
                    ></Select>
                    {errors.trip && (
                      <p className="text-danger mt-2">{errors.trip.message}</p>
                    )}
                  </>
                )}
              ></Controller>
            </Form.Group>
          )}
        </Row>
        <Row className="mt-3">
          <Form.Group as={Col} md="6" lg="6" xl="5" xxl="4">
            <Form.Label>Coupon Validity Till</Form.Label>
            <Form.Control
              type="date"
              placeholder="date"
              name="valid_till"
              min={new Date().toJSON().slice(0, 10)}
              {...register("valid_till", { required: true })}
              onBlur={() => {
                trigger("valid_till");
              }}
            />
            {errors.valid_till && errors.valid_till.type === "required" && (
              <p className="text-danger mt-2">* Coupon Validity required</p>
            )}
          </Form.Group>
          <Form.Group as={Col} md="6" lg="6" xl="3">
            <Form.Label>One time use (per user) </Form.Label>
            <Form.Select
              name="one_time_use"
              {...register("one_time_use", { valueAsNumber: true })}
            >
              <option value={0}>Yes</option>
              <option value={1}>No</option>
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col} md="5" lg="6" xl="5" xxl="4">
            <Form.Label>Discount (%)</Form.Label>
            <Form.Control
              type="number"
              name="discount"
              placeholder="Discount in percentage"
              {...register("discount", {
                required: true,
                pattern: /^-?\d+$/,
                valueAsNumber: true,
                min: 2,
                max: 98,
              })}
              onBlur={() => {
                trigger("discount");
              }}
            />
            {errors.discount && errors.discount.type === "pattern" && (
              <p className="text-danger mt-2"> * Discount should be integer</p>
            )}
            {errors.discount && errors.discount.type === "required" && (
              <p className="text-danger mt-2"> * Discount required</p>
            )}
            {errors.discount && errors.discount.type === "min" && (
              <p className="text-danger mt-2">
                {" "}
                * Discount Should be minimum 2%
              </p>
            )}
            {errors.discount && errors.discount.type === "max" && (
              <p className="text-danger mt-2">
                {" "}
                * Discount Should be maximum 98%
              </p>
            )}
          </Form.Group>
        </Row>
        <Row className="mt-3">
          <Col>
            <Button type="submit">Create Coupon</Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
export default CreateCoupon;