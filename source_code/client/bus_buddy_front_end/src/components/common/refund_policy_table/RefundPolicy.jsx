import Table from "react-bootstrap/Table";
function RefundPolicy()
{

    return(
        <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Time Period of Cancellation</th>
                <th>Refund (%)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Before 48 hours from the trip start time</td>
                <td>100 %</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Within 48 hours from the trip start time</td>
                <td>50%</td>
              </tr>
              <tr>
                <td>3</td>
                <td>On the same day as trip start's</td>
                <td>0%</td>
              </tr>
            </tbody>
          </Table>
    )
}export default RefundPolicy;