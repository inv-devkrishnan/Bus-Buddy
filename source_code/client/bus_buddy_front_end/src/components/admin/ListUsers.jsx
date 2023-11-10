import { useEffect, useRef, useState, useCallback } from "react";
import PropTypes from "prop-types";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";

import Swal from "sweetalert2";

import { axiosApi } from "../../utils/axiosApi";
import { getErrorMessage } from "../../utils/getErrorMessage";

function ListUsers(props) {
  const [users, setUsers] = useState([]); // to store user list

  const [totalPages, setTotalPages] = useState(0); // to store total pages
  const [currentPage, setCurrentPage] = useState(1); // to get current page
  const [hasPrevious, setHasPrevious] = useState(false); // to check if current page has previous page
  const [hasNext, setHasNext] = useState(false); // to check if current page has next page
  const [searchField, setSearchField] = useState(""); // to store search key words

  const [searchMode, setSearchMode] = useState(false);
  const listOrder = useRef(-1); // to store the sorting order
  const userStatus = useRef(props.busApproval ? 3 : 100); // to store the user status

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [busOwnerInfo, setBusOwnerInfo] = useState({});

  const getUsers = useCallback(
    async (url) => {
      // url is provided for search,sort,and view by status if no url is provided all users is displayed
      if (url) {
        await axiosApi
          .get(url)
          .then((result) => {
            setUsers(result?.data?.users);
            setTotalPages(result?.data?.pages);
            setCurrentPage(result?.data?.current_page);
            setCurrentPage(result?.data?.current_page);
            setHasPrevious(Boolean(result?.data?.has_previous));
            setHasNext(Boolean(result?.data?.has_next));
            console.log(result.data);
          })
          .catch(function (error) {
            Swal.fire({
              title: "Something went wrong !",
              icon: "error",
              text: getErrorMessage(error?.response?.data?.error_code),
            });
          });
      } else {
        props.busApproval
          ? await axiosApi
              .get("adminstrator/list-users/?status=3")
              .then((result) => {
                setUsers(result?.data?.users);
                setTotalPages(result?.data?.pages);
                setCurrentPage(result?.data?.current_page);
                setHasPrevious(Boolean(result?.data?.has_previous));
                setHasNext(Boolean(result?.data?.has_next));
                console.log(result.data);
              })
              .catch(function (error) {
                Swal.fire({
                  title: "Something went wrong !",
                  icon: "error",
                  text: getErrorMessage(error?.response?.data?.error_code),
                });
              })
          : await axiosApi
              .get("adminstrator/list-users/")
              .then((result) => {
                setUsers(result?.data?.users);
                setTotalPages(result?.data?.pages);
                setCurrentPage(result?.data?.current_page);
                setHasPrevious(Boolean(result?.data?.has_previous));
                setHasNext(Boolean(result?.data?.has_next));
                console.log(result.data);
              })
              .catch(function (error) {
                Swal.fire({
                  title: "Something went wrong !",
                  icon: "error",
                  text: getErrorMessage(error?.response?.data?.error_code),
                });
              });
      }
    },
    [props.busApproval]
  );

  useEffect(() => {
    // loads the users during page startup
    getUsers();
  }, [getUsers]);

  const errorMessage = (error) => {
    Swal.fire({
      title: "Something went wrong !",
      icon: "error",
      text: getErrorMessage(error?.response?.data?.error_code),
    });
  };

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
    if (userStatus.current !== 100) {
      getUsers(
        `adminstrator/list-users/?page=${page}&order=${listOrder.current}&status=${userStatus.current}`
      );
    } else {
      getUsers(
        `adminstrator/list-users/?page=${page}&order=${listOrder.current}`
      );
    }
  };

  const searchUsers = async (keyword) => {
    // this function allows us to search users
    if (searchField) {
      setSearchMode(true);
      // check if its bus owner approval page or not if yes only search for busowners
      props.busApproval
        ? getUsers(`adminstrator/list-users/?keyword=${keyword}&type=1`)
        : getUsers(`adminstrator/list-users/?keyword=${keyword}&type=0`);

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
      await axiosApi
        .put(`adminstrator/ban-user/${user_id}/`)
        .then((result) => {
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
          errorMessage(error);
        });
    }
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
      await axiosApi
        .put(`adminstrator/unban-user/${user_id}/`)
        .then((result) => {
          Swal.fire({
            title: "User Ban Removed !",
            icon: "success",
          });
          getUsersbyPage(currentPage);
          // sets search mode false if user unban done through search
          setSearchMode(false);
        })
        .catch(function (error) {
          errorMessage(error);
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
      await axiosApi
        .put(`adminstrator/remove-user/${user_id}/`)
        .then((result) => {
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
          errorMessage(error);
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
      Swal.showLoading();
      Swal.fire({
        title: "Please Wait",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCancelButton: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      await axiosApi
        .put(`adminstrator/approve-bus-owner/${user_id}/`)
        .then((result) => {
          Swal.fire({
            title: "Bus Owner Approved !",
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
          errorMessage(error);
        });
    }
  };

  const formatAadhaarNumber = (aadhaarNo) => {
    if (aadhaarNo !== undefined) {
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

  const generatePaginator = (pages) => {
    // function to show pages at bottom
    let pageItem = [];
    for (let i = 1; i <= pages; ++i) {
      pageItem.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => {
            getUsersbyPage(i);
          }}
        >
          {i}
        </Pagination.Item>
      );
    }
    return pageItem;
  };

  return (
    <Container className="ms-2 mt-2">
      <Row>
        <Col>
          <h1 className="ms-3">
            {props.busApproval ? "Bus owner Approval" : "List Users"}
          </h1>
        </Col>
      </Row>

      <Row>
        <Col className="ms-5">
          <Dropdown>
            <Dropdown.Toggle variant="light" disabled={searchMode}>
              {/* shows current sorting mode */}
              Sort : {listOrder.current === -1 && "None"}
              {listOrder.current === 0 && " Name Ascending"}
              {listOrder.current === 1 && " Name Descending"}
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

        <Col>
          <Dropdown className={props.busApproval ? "invisible" : "visible"}>
            <Dropdown.Toggle variant="light" disabled={searchMode}>
              {/* shows current user status mode */}
              Show {userStatus.current === 100 && "All Users"}
              {userStatus.current === 0 && "Unbanned Users"}
              {userStatus.current === 2 && "Banned Users"}
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
        <Col>
          <div className="d-flex">
            <Form.Control
              placeholder="Search"
              value={searchField}
              onChange={(e) => {
                setSearchField(e.target.value);
              }}
              disabled={searchMode}
            />
            {searchMode ? (
              <Button
                variant="danger"
                className="d-block ms-3"
                onClick={() => {
                  setSearchField("");
                  props.busApproval && (userStatus.current = 3);
                  getUsersbyPage(1);
                  setSearchMode(false);
                }}
              >
                Clear
              </Button>
            ) : (
              <Button
                className="d-block ms-3"
                onClick={() => {
                  searchUsers(searchField);
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
            <h2>Search Results for : {searchField}</h2>
          </Row>
        )
      }

      <Row>
        <Col style={{ width: "70vw" }}>
          <Table bordered hover variant="light" className="m-5">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.first_name}</td>
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
                    {user.status === 3 && props.busApproval && (
                      <Button
                        variant="primary"
                        onClick={() => {
                          setBusOwnerInfo(user);
                          handleShow();
                        }}
                      >
                        View Details
                      </Button>
                    )}
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
        </Col>
      </Row>
      <Row>
        <Pagination
          size="md"
          style={{
            width: "70%",
            position: "fixed",
            bottom: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Pagination.First
            onClick={() => {
              // move to first page
              getUsersbyPage(1);
            }}
          />
          <Pagination.Prev
            // checks if data have previous page then move to previous page
            onClick={() => {
              hasPrevious && getUsersbyPage(currentPage - 1);
            }}
          />
          {
            // shows the page numbers
            generatePaginator(totalPages)
          }
          <Pagination.Next
            // checks if data have next page then move to next page
            onClick={() => {
              hasNext && getUsersbyPage(currentPage + 1);
            }}
          />
          <Pagination.Last
            // move to last  page
            onClick={() => getUsersbyPage(totalPages)}
          />
        </Pagination>
      </Row>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Bus Owner Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            <ListGroup.Item className="d-flex">
              <p className="m-0 me-3">First Name</p>
              <p className="m-0">:</p>
              <p className="m-0 ms-3">{busOwnerInfo.first_name}</p>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex">
              <p className="m-0 me-3">Last Name</p>
              <p className="m-0">:</p>
              <p className="m-0 ms-3">{busOwnerInfo.last_name}</p>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex">
              <p className="m-0 me-5">Email</p>
              <p className="m-0">:</p>
              <p className="m-0 ms-3">{busOwnerInfo.email}</p>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex">
              <p className="m-0 me-3">Phone</p>
              <p className="m-0">:</p>
              <p className="m-0 ms-3">{busOwnerInfo.phone}</p>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex">
              <p className="m-0 me-3">Company Name</p>
              <p className="m-0">:</p>
              <p className="m-0 ms-3">{busOwnerInfo.company_name}</p>
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
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="success"
            onClick={() => {
              approveBusOwner(busOwnerInfo.id);
              handleClose();
            }}
          >
            Approve Bus Owner
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
