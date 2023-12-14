import Pagination from "react-bootstrap/Pagination";
import Proptypes from "prop-types";
import "./customPaginator.css";
function CustomPaginator(props) {
  const generatePaginator = (pages) => {
    // function to show pages at bottom
    if (pages <= props.PAGE_LIMIT) {
      // if pages are less than page limit no need to show ellipsis
      let pageItem = [];
      for (let i = 1; i <= pages; ++i) {
        pageItem.push(
          <Pagination.Item
            key={i}
            active={i === props.currentPage}
            onClick={() => {
              props.viewPage(i);
            }}
          >
            {i}
          </Pagination.Item>
        );
      }
      return pageItem;
    } else {
      let pageItem = [];
      if (props.pageStartLimit >= props.PAGE_LIMIT) {
        /* if pageStartLimit is greater than initial PAGE_LIMIT means previous pages exists
         so show the previous page ellipsis */
        pageItem.push(
          <Pagination.Ellipsis
            key={-2}
            onClick={() => {
              decrementPageLimit(props.pageStartLimit);
              // the last page of the new page list will get automatically selected
              props.viewPage(props.pageStartLimit - 1);
            }}
          ></Pagination.Ellipsis>
        );
      }
      for (let i = props.pageStartLimit; i <= props.pageEndLimit; ++i) {
        // page items are shown based start and endlimits
        // checks weather page i is within total pages (in case of deletion )
        if (i <= props.totalPages) {
          pageItem.push(
            <Pagination.Item
              key={i}
              active={i === props.currentPage}
              onClick={() => {
                props.viewPage(i);
              }}
            >
              {i}
            </Pagination.Item>
          );
        }
      }
      // shows the ellipsis to reveal next set of page numbers

      // if current page list doesn't contain the last page than only show the Ellipsis
      if (!isPageNumberVisible(props.totalPages)) {
        pageItem.push(
          <Pagination.Ellipsis
            key={-1}
            onClick={() => {
              incrementPageLimit(props.pageEndLimit, pages);
              // the first page of the new page list will get automatically selected
              props.viewPage(props.pageEndLimit + 1);
            }}
          ></Pagination.Ellipsis>
        );
      }

      return pageItem;
    }
  };

  const incrementPageLimit = (previousLimit, totalPages) => {
    // new start limit will be the previous end limit
    props.setPageStartLimit(props.pageEndLimit + 1);
    if (previousLimit + props.PAGE_LIMIT <= totalPages) {
      props.setPageEndLimit(previousLimit + props.PAGE_LIMIT);
    } else {
      props.setPageEndLimit(totalPages);
    }
  };

  const decrementPageLimit = (previousLimit) => {
    props.setPageEndLimit(previousLimit - 1);
    if (previousLimit - props.PAGE_LIMIT >= props.PAGE_LIMIT) {
      props.setPageStartLimit(previousLimit - props.PAGE_LIMIT);
    } else {
      props.setPageStartLimit(1);
    }
  };

  const isPageNumberVisible = (page) => {
    // function to check the given page number is on current page list
    return !!(page >= props.pageStartLimit && page <= props.pageEndLimit);
  };

  const viewPreviousPageNumbers = (currentPage) => {
    /*function checks if given page is in the current page number list 
      if not loads previous page number list */
    !isPageNumberVisible(currentPage - 1) &&
      currentPage - 1 > 1 &&
      decrementPageLimit(props.pageStartLimit);
  };

  const viewNextPageNumbers = (currentPage) => {
    /*function checks if given page is in the current page number list 
      if not loads next page number list */
    !isPageNumberVisible(currentPage + 1) &&
      currentPage + 1 <= props.totalPages &&
      incrementPageLimit(props.pageEndLimit, props.totalPages);
  };
  const viewFirstPageNumbers = () => {
    // function view to view the first page number list
    props.setPageStartLimit(1);
    props.setPageEndLimit(props.PAGE_LIMIT);
  };
  const viewLastPageNumbers = () => {
    // function view to view the last  page number list
    props.setPageStartLimit(props.totalPages - props.PAGE_LIMIT);
    props.setPageEndLimit(props.totalPages);
  };
  return (
    <Pagination
      size="md"
      className="paginator"
      style={{
        width: props.width,
        position: "fixed",
        bottom: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Pagination.First
        onClick={() => {
          // move to first page
          props.viewPage(1);
          // set the first section of page numbers
          props.totalPages >= props.PAGE_LIMIT && viewFirstPageNumbers();
        }}
      />
      <Pagination.Prev
        // checks if data have previous page then move to previous page
        onClick={() => {
          props.hasPrevious && props.viewPage(props.currentPage - 1);
          props.totalPages >= props.PAGE_LIMIT &&
            viewPreviousPageNumbers(props.currentPage);
        }}
      />
      {
        // shows the page numbers
        generatePaginator(props.totalPages)
      }
      <Pagination.Next
        // checks if data have next page then move to next page
        onClick={() => {
          props.hasNext && props.viewPage(props.currentPage + 1);
          props.totalPages >= props.PAGE_LIMIT &&
            viewNextPageNumbers(props.currentPage);
        }}
      />
      <Pagination.Last
        // move to last  page
        onClick={() => {
          props.viewPage(props.totalPages);
          // set the last section of page numbers
          props.totalPages >= props.PAGE_LIMIT && viewLastPageNumbers();
        }}
      />
    </Pagination>
  );
}

CustomPaginator.propTypes = {
  PAGE_LIMIT: Proptypes.number, // initial number of page numbers that should be shown in the pagination
  totalPages: Proptypes.number, // to store total pages
  currentPage: Proptypes.number, // to get current page
  hasPrevious: Proptypes.bool, // to check if current page has previous page
  hasNext: Proptypes.bool, // to check if current page has next page
  pageStartLimit: Proptypes.number, // start limit of page numbers to be shown in pagination
  pageEndLimit: Proptypes.number, // end limit of page numbers to be shown in pagination
  setPageStartLimit: Proptypes.func, // function to set start limit of page numbers to be shown in pagination
  setPageEndLimit: Proptypes.func, // function to set end limit of page numbers to be shown in pagination
  viewPage: Proptypes.func, // returns the page number
  width: Proptypes.string, // to adjust horizontal position of paginator
};
export default CustomPaginator;
