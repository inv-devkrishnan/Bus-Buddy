import React from 'react';
import { render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ViewComplaints from './ViewComplaints';
import { axiosApi } from '../../../utils/axiosApi';

const mockComplaintsData = {
  complaints: [
    {
      id: 1,
      complaint_title: 'Test Complaint 1',
      user: { first_name: 'Test User 1' },
      created_date: '2022-01-11',
      status: 0,
      complaint_body: 'Test Complaint Body 1',
    },
    // Add more mock complaints as needed
  ],
  pages: 5,
  current_page: 1,
  has_previous: false,
};

// jest.mock("../interceptor/apiServic", () => {
//   return {
//     axiosApi: jest.fn(),
//   };
// });

describe('ViewComplaints component', () => {

  it('renders with default data', async () => {
    // axiosApi.mockResolvedValue({
    //   donation_count: 0,
    // });
    render(<ViewComplaints />);
  });

  it('applies date filter', async () => {
    // Mock Axios GET request

    render(<ViewComplaints />);

    // Simulate clicking the "Filter by Date" button
    fireEvent.click(screen.getByText('Filter by Date'));

    // Check if the date filter modal is opened
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Simulate selecting "From" and "To" dates in the filter modal
    fireEvent.change(screen.getByPlaceholderText(/From date/i), { target: { value: '2022-01-01' } });
    fireEvent.change(screen.getByPlaceholderText(/To date/i), { target: { value: '2022-01-31' } });

    // Simulate clicking the "Filter" button in the filter modal
    fireEvent.click(screen.getByText('Filter'));
  
    // Wait for the Axios request to complete

    // Check if the component renders the complaints after applying date filter
  });

  it('clear date filter', async () => {
    // Mock Axios GET request

    render(<ViewComplaints />);

    // Simulate clicking the "Filter by Date" button
    fireEvent.click(screen.getByText('Filter by Date'));

    // Check if the date filter modal is opened
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Simulate selecting "From" and "To" dates in the filter modal
    fireEvent.change(screen.getByPlaceholderText(/From date/i), { target: { value: '2022-01-01' } });
    fireEvent.change(screen.getByPlaceholderText(/To date/i), { target: { value: '2022-01-31' } });

    // Simulate clicking the "Filter" button in the filter modal
    fireEvent.click(screen.getByText('Clear Filter'));
  
    // Wait for the Axios request to complete

    // Check if the component renders the complaints after applying date filter
  });

  it('date filter error', async () => {
    // Mock Axios GET request

    render(<ViewComplaints />);

    // Simulate clicking the "Filter by Date" button
    fireEvent.click(screen.getByText('Filter by Date'));

    // Check if the date filter modal is opened
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Simulate selecting "From" and "To" dates in the filter modal
    fireEvent.change(screen.getByPlaceholderText(/From date/i), { target: { value: '' } });
    fireEvent.change(screen.getByPlaceholderText(/To date/i), { target: { value: '' } });

    // Simulate clicking the "Filter" button in the filter modal
    fireEvent.click(screen.getByText('Filter'));
  
    // Wait for the Axios request to complete

    // Check if the component renders the complaints after applying date filter
  });

  it('date filter invalid case', async () => {
    // Mock Axios GET request

    render(<ViewComplaints />);

    // Simulate clicking the "Filter by Date" button
    fireEvent.click(screen.getByText('Filter by Date'));

    // Check if the date filter modal is opened

    // Simulate selecting "From" and "To" dates in the filter modal
    fireEvent.change(screen.getByPlaceholderText(/From date/i), { target: { value: '2022-01-31' } });
    fireEvent.change(screen.getByPlaceholderText(/To date/i), { target: { value: '2022-01-01' } });

    // Simulate clicking the "Filter" button in the filter modal
    fireEvent.click(screen.getByText('Filter'));
  
    // Wait for the Axios request to complete

    // Check if the component renders the complaints after applying date filter
  });


  // Add more tests as needed for other functionalities of the ViewComplaints component
});


