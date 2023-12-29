import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Proptypes from "prop-types";
import { useState,useEffect } from "react";
function CustomPaginator(props) {
   const [isSmallScreen, setIsSmallScreen] = useState(false);
   
  const handleChange = (event, value) => {
    props.viewPage(value);
  };

  useEffect(() => {
    // Function to handle window resize events
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 576);
    };

    // Initial check and event listener setup
    handleResize();
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div>
      <Stack>
        <Pagination
          color="primary"
          variant="outlined"
          shape="rounded"
          size={isSmallScreen?"small":"large"}
          count={props.totalPages}
          page={props.currentPage}
          onChange={handleChange}
          className="mb-3"
        />
      </Stack>
    </div>
  );
}

CustomPaginator.propTypes = {
  totalPages: Proptypes.number, // to store total pages
  currentPage: Proptypes.number, // to get current page
  viewPage: Proptypes.func, // returns the page number
};
export default CustomPaginator;
