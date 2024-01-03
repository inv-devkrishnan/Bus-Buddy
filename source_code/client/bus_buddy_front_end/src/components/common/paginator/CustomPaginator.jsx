import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Proptypes from "prop-types";
import { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
function CustomPaginator(props) {
  // to set color of paginator
  const theme = createTheme({
    palette: {
      primary: {
        main: "#0d6efd",
      },
    },
  });
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const handleChange = (event, value) => {
    props.viewPage(value);
  };

  useEffect(() => {
    // Function to handle window resize events
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 576);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Stack>
          <Pagination
            color="primary"
            shape="rounded"
            size={isSmallScreen ? "small" : "large"}
            count={props.totalPages}
            page={props.currentPage}
            onChange={handleChange}
            className="mb-3"
          />
        </Stack>
      </ThemeProvider>
    </div>
  );
}

CustomPaginator.propTypes = {
  totalPages: Proptypes.number, // to store total pages
  currentPage: Proptypes.number, // to get current page
  viewPage: Proptypes.func, // returns the page number
};
export default CustomPaginator;
