import { useEffect, useRef, useState, useCallback } from "react";
import PropTypes from "prop-types";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
import { ExclamationCircle } from "react-bootstrap-icons";
import ProgressBar from "react-bootstrap/ProgressBar";

import Swal from "sweetalert2";
import { axiosApi } from "../../utils/axiosApi";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { showLoadingAlert } from "../common/loading_alert/LoadingAlert";
import CustomPaginator from "../common/paginator/CustomPaginator";

function ListUsers(props) {
  const [users, setUsers] = useState([]); // to store user list

  const [totalPages, setTotalPages] = useState(0); // to store total pages
  const [currentPage, setCurrentPage] = useState(1); // to get current page
  const [hasPrevious, setHasPrevious] = useState(false); // to check if current page has previous page

  const [searchMode, setSearchMode] = useState(false);
  const listOrder = useRef(-1); // to store the sorting order
  const userStatus = useRef(props.busApproval ? 3 : 100); // to store the user status
  const userRole = useRef(100); // to store current user role
  const [isTableLoading, setIsTableLoading] = useState(false);

  const [showBusOwnerInfo, setShowBusOwnerInfo] = useState(false);
  const handleBusOwnerInfoClose = () => setShowBusOwnerInfo(false);
  const handleBusOwnerInfoShow = () => setShowBusOwnerInfo(true);

  const [showUserInfo, setShowUserInfo] = useState(false);
  const handleUserInfoClose = () => setShowUserInfo(false);
  const handleUserInfoShow = () => setShowUserInfo(true);

  const [busOwnerInfo, setBusOwnerInfo] = useState({});
  let searchbox = document.getElementById("search_box");

  const displayErrorMessage = (error) => {
    Swal.fire({
      title: "Something went wrong !",
      icon: "error",
      text: getErrorMessage(error?.response?.data?.error_code),
    });
  };

  const getUsers = useCallback(
    async (url) => {
      // url is provided for search,sort,and view by status if no url is provided all users is displayed
      let default_url;
      if (url) {
        default_url = url;
      } else {
        default_url = props.busApproval
          ? "adminstrator/list-users/?status=3"
          : "adminstrator/list-users/";
      }
      setIsTableLoading(true);
      await axiosApi
        .get(default_url)
        .then((result) => {
          setUsers(result?.data?.users);
          setTotalPages(result?.data?.pages);
          setCurrentPage(result?.data?.current_page);
          setCurrentPage(result?.data?.current_page);
          setHasPrevious(Boolean(result?.data?.has_previous));
          console.log(result.data);
        })
        .catch(function (error) {
          displayErrorMessage(error);
        });
      setIsTableLoading(false);
    },
    [props.busApproval]
  );

  useEffect(() => {
    // loads the users during page startup
    userStatus.current = props.busApproval ? 3 : 100;
    userRole.current = 100;
    listOrder.current = -1;
    if (searchbox) {
      searchbox.value = "";
      setSearchMode(false);
    }

    getUsers();
  }, [getUsers, props.busApproval, searchbox]);

  const showDialog = (dialogData) => {
    return Swal.fire({
      title: dialogData.title,
      text: dialogData.text,
      icon: dialogData.icon,
      confirmButtonText: dialogData.confirmButtonText,
      confirmButtonColor: dialogData.confirmButtonColor,
      showCancelButton: dialogData.showCancelButton,
      cancelButtonText: dialogData.cancelButtonText,
    });
  };

  const getUsersbyPage = async (page) => {
    // this function allows us to call specific page of userlist

    // if user status is 100 means all users
    if (userStatus.current !== 100 || userRole.current !== 100) {
      getUsers(
        `adminstrator/list-users/?page=${page}&order=${listOrder.current}${
          userStatus.current !== 100 ? "&status=" + userStatus.current : ""
        }${userRole.current !== 100 ? "&role=" + userRole.current : ""}`
      );
    } else if (searchbox.value) {
      props.busApproval
        ? getUsers(
            `adminstrator/list-users/?page=${page}&keyword=${searchbox.value}&status=3`
          )
        : getUsers(
            `adminstrator/list-users/?page=${page}&keyword=${searchbox.value}`
          );
    } else {
      getUsers(
        `adminstrator/list-users/?page=${page}&order=${listOrder.current}`
      );
    }
  };

  const showRoles = (role) => {
    switch (role) {
      case 2:
        return "Normal Users";
      case 3:
        return "Bus Owners";
      default:
        return "All Roles";
    }
  };

  const showStatus = (status) => {
    switch (status) {
      case 0:
        return "Unbanned Users";
      case 2:
        return "Banned Users";
      default:
        return "All Users";
    }
  };
  const showOrder = (order) => {
    switch (order) {
      case 0:
        return " Name Ascending";
      case 1:
        return " Name Descending";
      default:
        return "None";
    }
  };

  const searchUsers = async () => {
    // this function allows us to search users
    if (searchbox.value) {
      setSearchMode(true);
      // check if its bus owner approval page or not if yes only search for busowners
      props.busApproval
        ? getUsers(
            `adminstrator/list-users/?keyword=${searchbox.value}&status=3`
          )
        : getUsers(`adminstrator/list-users/?keyword=${searchbox.value}`);

      listOrder.current = -1;
      userStatus.current = 100;
    }
  };
  const banUser = async (user_id) => {
    // this function performs baning of user

    //shows dialog
    const banDialogdata = {
      title: "Ban User",
      text: "Are you sure you want to ban this user",
      icon: "warning",
      confirmButtonText: "Ban user",
      confirmButtonColor: "#f0ad4e",
      showCancelButton: true,
      cancelButtonText: "Cancel",
    };

    // if dialog is confirmed
    if ((await showDialog(banDialogdata)).isConfirmed) {
      showLoadingAlert("Banning User");
      await axiosApi
        .put(`adminstrator/ban-user/${user_id}/`)
        .then((result) => {
          Swal.close();
          Swal.fire({
            title: "User Banned !",
            icon: "success",
          });
          // reloads current page
          getUsersbyPage(currentPage);
          // sets search mode false if user ban done through search
          setSearchMode(false);
        })
        .catch(function (error) {
          Swal.close();
          displayErrorMessage(error);
        });
    }
  };

  const userInfo = () => {
    return (
      <>
        <ListGroup.Item className="d-flex">
          <p className="m-0 me-3">First Name</p>
          <p className="m-0">:</p>
          <p className="m-0 ms-3" style={{wordWrap:"anywhere"}}>{busOwnerInfo.first_name}</p>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex">
          <p className="m-0 me-3">Last Name</p>
          <p className="m-0">:</p>
          <p className="m-0 ms-3"  style={{wordWrap:"anywhere"}}>{busOwnerInfo.last_name || "Not Provided"}</p>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex">
          <p className="m-0 me-3">Email</p>
          <p className="m-0">:</p>
          <p className="m-0 ms-3"  style={{wordWrap:"anywhere"}}>{busOwnerInfo.email}</p>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex">
          <p className="m-0 me-3">Phone</p>
          <p className="m-0">:</p>
          <p className="m-0 ms-3">{busOwnerInfo.phone || "Not Provided"}</p>
        </ListGroup.Item>
      </>
    );
  };

  const unBanUser = async (user_id) => {
    // this function performs unbaning of user

    //shows dialog
    const unBanUserDialog = {
      title: "UnBan User",
      text: "Are you sure you want to unban this user",
      icon: "warning",
      confirmButtonText: "UnBan user",
      confirmButtonColor: "#5cb85c",
      showCancelButton: true,
      cancelButtonText: "Cancel",
    };

    // if confirmed
    if ((await showDialog(unBanUserDialog)).isConfirmed) {
      showLoadingAlert("Unbaning User");
      await axiosApi
        .put(`adminstrator/unban-user/${user_id}/`)
        .then((result) => {
          Swal.close();
          Swal.fire({
            title: "User Ban Removed !",
            icon: "success",
          });
          getUsersbyPage(currentPage);
          // sets search mode false if user unban done through search
          setSearchMode(false);
        })
        .catch(function (error) {
          Swal.close();
          displayErrorMessage(error);
        });
    }
  };

  const removeUser = async (user_id) => {
    // this function performs removal of user

    // shows dialog
    const removeUserDialog = {
      title: "Remove User",
      text: "Are you sure you want to remove this user",
      icon: "warning",
      confirmButtonText: "Remove user",
      confirmButtonColor: "#d9534f",
      showCancelButton: true,
      cancelButtonText: "Cancel",
    };
    // if confirmed
    if ((await showDialog(removeUserDialog)).isConfirmed) {
      showLoadingAlert("Removing User");
      await axiosApi
        .put(`adminstrator/remove-user/${user_id}/`)
        .then((result) => {
          Swal.close();
          Swal.fire({
            title: "User Removed !",
            icon: "success",
          });
          // sets search mode false if user removal done through search
          setSearchMode(false);
          // loads the current page only if current page is not empty after deletion
          if (users.length > 1) {
            getUsersbyPage(currentPage);
          } // loads the previous page if current page is empty
          else if (hasPrevious) {
            getUsersbyPage(currentPage - 1);
          } // loads the first page is previous not avaliable
          else {
            getUsersbyPage(1);
          }
        })
        .catch(function (error) {
          Swal.close();
          displayErrorMessage(error);
        });
    }
  };

  const approveBusOwner = async (user_id) => {
    // this function performs removal of user

    // shows dialog
    const approveUserDialog = {
      title: "Approve Bus Owner",
      text: "Are you sure you want to Approve this Bus owner",
      icon: "warning",
      confirmButtonText: "Yes",
      confirmButtonColor: "#d9534f",
      showCancelButton: true,
      cancelButtonText: "Cancel",
    };
    // if confirmed
    if ((await showDialog(approveUserDialog)).isConfirmed) {
      showLoadingAlert("Approving Bus Owner"); // shows loading screen because sending email can take some time
      await axiosApi
        .put(`adminstrator/approve-bus-owner/${user_id}/`)
        .then((result) => {
          Swal.close();
          Swal.fire({
            title: "Bus Owner Approved !",
            icon: "success",
          });
          // sets search mode false if user removal done through search
          setSearchMode(false);
          // setting user status to 3 if user removal done through search
          userStatus.current = 3;
          // loads the current page only if current page is not empty after deletion
          if (users.length > 1) {
            getUsersbyPage(currentPage);
          } // loads the previous page if current page is empty
          else if (hasPrevious) {
            getUsersbyPage(currentPage - 1);
          } // loads the first page is previous not avaliable
          else {
            getUsersbyPage(1);
          }
        })
        .catch(function (error) {
          Swal.close();
          displayErrorMessage(error);
        });
    }
  };

  const formatAadhaarNumber = (aadhaarNo) => {
    if (aadhaarNo !== undefined && aadhaarNo !== null) {
      let partLength = Math.ceil(aadhaarNo.length / 3);

      // Divide the string into four parts
      let part1 = aadhaarNo.substring(0, partLength);
      let part2 = aadhaarNo.substring(partLength, 2 * partLength);
      let part3 = aadhaarNo.substring(2 * partLength, 3 * partLength);
      // Return the adhaar No
      return [part1, part2, part3];
    }
    return [];
  };
  return (
    <Container fluid className="ms-2 mt-2">
      <Row>
        <Col>
          <h1 className="ms-3">
            {props.busApproval ? "Bus owner Approval" : "List Users"}
          </h1>
        </Col>
      </Row>

      <Row>
        <Col xl={3} lg={3} md={6} sm={3}>
          <Dropdown>
            <Dropdown.Toggle variant="light" disabled={searchMode}>
              {/* shows current sorting mode */}
              Sort : {showOrder(listOrder.current)}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => {
                  listOrder.current = 0;
                  getUsersbyPage(currentPage);
                }}
              >
                Name Ascending
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  listOrder.current = 1;
                  getUsersbyPage(currentPage);
                }}
              >
                Name Descending
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  listOrder.current = -1;
                  getUsersbyPage(currentPage);
                }}
              >
                None
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>

        <Col xl={3} lg={3} md={6} sm={3}>
          <Dropdown className={props.busApproval ? "invisible" : "visible"}>
            <Dropdown.Toggle variant="light" disabled={searchMode}>
              {/* shows current user status mode */}
              Show {showStatus(userStatus.current)}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => {
                  userStatus.current = 2;
                  console.log(userStatus.current);
                  getUsersbyPage(1);
                }}
              >
                Banned Users
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  userStatus.current = 0;
                  console.log(userStatus.current);
                  getUsersbyPage(1);
                }}
              >
                Unbanned Users
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  userStatus.current = 100;
                  console.log(userStatus.current);
                  getUsersbyPage(1);
                }}
              >
                Show All
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col xl={3} lg={3} md={6} sm={3}>
          <Dropdown className={props.busApproval ? "invisible" : "visible"}>
            <Dropdown.Toggle variant="light" disabled={searchMode}>
              {/* shows current user status mode */}
              Show {showRoles(userRole.current)}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => {
                  userRole.current = 2;
                  console.log(userRole.current);
                  getUsersbyPage(1);
                }}
              >
                Normal Users
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  userRole.current = 3;
                  console.log(userRole.current);
                  getUsersbyPage(1);
                }}
              >
                Bus Owners
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  userRole.current = 100;
                  console.log(userRole.current);
                  getUsersbyPage(1);
                }}
              >
                Show All
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col xl={3} lg={3} md={12} sm={6}>
          <div className="d-flex">
            <Form.Control
              placeholder="Search"
              id="search_box"
              maxLength={50}
              disabled={searchMode}
            />
            {searchMode ? (
              <Button
                variant="danger"
                className="d-block ms-3"
                onClick={() => {
                  searchbox.value = "";
                  props.busApproval && (userStatus.current = 3);
                  setSearchMode(false);
                  getUsersbyPage(1);
                }}
              >
                Clear
              </Button>
            ) : (
              <Button
                className="d-block ms-3"
                onClick={() => {
                  searchUsers();
                }}
              >
                Search
              </Button>
            )}
          </div>
        </Col>
      </Row>
      {
        // to show search results info
        searchMode && (
          <Row className="mt-5 ms-5">
            <h2>Search Results for : {searchbox.value}</h2>
          </Row>
        )
      }

      <Row className="ms-auto me-auto">
        <div>
          {isTableLoading ? (
            <div className="mt-5">
              <ProgressBar
                animated
                now={100}
                className="w-25 ms-auto me-auto"
              />
              <p className="ms-3 mt-3 text-center">Please Wait</p>
            </div>
          ) : (
            <div>
              {users.length > 0 ? (
                <Table hover variant="light" responsive className="mb-5">
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Email</th>
                      <th></th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="fw-bold">{user.id}</td>
                        <td>{user.first_name}</td>
                        <td>
                          {user.role === 3 && "Bus Owner"}
                          {user.role === 2 && "Normal User"}
                        </td>
                        <td>{user.email}</td>
                        <td>
                          {user.status === 2 && (
                            <Button
                              variant="success"
                              onClick={() => {
                                unBanUser(user.id);
                              }}
                            >
                              Unban User
                            </Button>
                          )}
                          {user.status === 0 && (
                            <Button
                              variant="warning"
                              onClick={() => {
                                banUser(user.id);
                              }}
                            >
                              Ban User
                            </Button>
                          )}
                        </td>
                        <td>
                          <Button
                            variant="primary"
                            onClick={() => {
                              setBusOwnerInfo(user);
                              user.role === 3
                                ? handleBusOwnerInfoShow()
                                : handleUserInfoShow();
                            }}
                          >
                            View Details
                          </Button>
                        </td>
                        {!props.busApproval && (
                          <td>
                            <Button
                              variant="danger"
                              onClick={() => {
                                removeUser(user.id);
                              }}
                            >
                              Remove User
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="mt-5">
                  <div className="d-flex justify-content-center">
                    <ExclamationCircle size={36}></ExclamationCircle>
                  </div>
                  <h3 className="text-center mt-3 mb-5">List empty !</h3>
                </div>
              )}
            </div>
          )}
        </div>
      </Row>
      <Row>
        <Col className="d-flex justify-content-center">
          {!isTableLoading && users.length > 0 && (
            <CustomPaginator
              totalPages={totalPages}
              currentPage={currentPage}
              viewPage={getUsersbyPage}
            ></CustomPaginator>
          )}
        </Col>
      </Row>
      <Modal
        show={showBusOwnerInfo}
        onHide={handleBusOwnerInfoClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Bus Owner Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {userInfo()}
            <ListGroup.Item className="d-flex">
              <p className="m-0 me-3">Company Name</p>
              <p className="m-0">:</p>
              <p className="m-0 ms-3"  style={{wordWrap:"anywhere"}}>{busOwnerInfo.company_name}</p>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex">
              <p className="m-0 me-3">Aadhaar No</p>
              <p className="m-0">:</p>
              <div className="d-flex ms-3">
                {formatAadhaarNumber(busOwnerInfo.aadhaar_no).map((block) => (
                  <p className="m-0" key={block}>
                    {block}&nbsp;
                  </p>
                ))}
              </div>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex">
              <p className="m-0 me-3">MSME number</p>
              <p className="m-0">:</p>
              <p className="m-0 ms-3">{busOwnerInfo.msme_no}</p>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex">
              <p className="m-0 me-3">GST</p>
              <p className="m-0">:</p>
              <p className="m-0 ms-3">{busOwnerInfo.extra_charges} %</p>
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleBusOwnerInfoClose}>
            Close
          </Button>
          {props.busApproval && (
            <Button
              variant="success"
              onClick={() => {
                approveBusOwner(busOwnerInfo.id);
                handleBusOwnerInfoClose();
              }}
            >
              Approve Bus Owner
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <Modal
        show={showUserInfo}
        onHide={handleUserInfoClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>{userInfo()}</ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleUserInfoClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
ListUsers.propTypes = {
  busApproval: PropTypes.bool,
};
export default ListUsers;
