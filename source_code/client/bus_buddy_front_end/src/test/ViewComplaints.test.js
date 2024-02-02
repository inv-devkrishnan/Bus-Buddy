import React from 'react';
import { render, screen, fireEvent,waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ViewComplaints from '../components/common/view_complaints/ViewComplaints';
import { axiosApi } from '../utils/axiosApi';
import MockAdapter from "axios-mock-adapter";

let mock;
const data = {
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

beforeEach(() => {
  mock = new MockAdapter(axiosApi);
});

afterEach(() => {
  mock.restore();
});




describe('ViewComplaints component', () => {

  it('renders with default data', async () => {

    render(<ViewComplaints />);
    mock.onGet(`adminstrator/view-complaints/`).reply(200, data);
  });
  it('renders with fail', async () => {

    const data = {
      pages: 5,
      current_page: 1,
      has_previous: false,
    };
    render(<ViewComplaints />);
    mock.onGet(`adminstrator/view-complaints/`).reply(200, data);
  });

  it('applies date filter', async () => {
    // Mock Axios GET request

    render(<ViewComplaints />);

    // Simulate clicking the "Filter by Date" button
    fireEvent.click(screen.getByTestId('Filter by Date'));

    // Check if the date filter modal is opened


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
    fireEvent.click(screen.getByTestId('Filter by Date'));

    // Check if the date filter modal is opened

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
    fireEvent.click(screen.getByTestId('Filter by Date'));

    // Check if the date filter modal is opened
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
    fireEvent.click(screen.getByTestId('Filter by Date'));

    // Check if the date filter modal is opened

    // Simulate selecting "From" and "To" dates in the filter modal
    fireEvent.change(screen.getByPlaceholderText(/From date/i), { target: { value: '2022-01-31' } });
    fireEvent.change(screen.getByPlaceholderText(/To date/i), { target: { value: '2022-01-01' } });

    // Simulate clicking the "Filter" button in the filter modal
    fireEvent.click(screen.getByText('Filter'));

    // Wait for the Axios request to complete

    // Check if the component renders the complaints after applying date filter
  });


  it('view responded complaints', async () => {
    // Mock Axios GET request

    render(<ViewComplaints />);


    fireEvent.click(screen.getByText('View : All'));
    fireEvent.click(screen.getByText('Responded Complaints'));
    mock.onGet(`adminstrator/view-complaints/`).reply(200, data);
  });

  it('view not responded complaints', async () => {
    // Mock Axios GET request

    render(<ViewComplaints />);
    fireEvent.click(screen.getByText('View : All'));
    fireEvent.click(screen.getByText('Not Responded Complaints'));
    mock.onGet(`adminstrator/view-complaints/`).reply(200, data);

    await waitFor(() => {
      expect(screen.getByText('View : Not Responded')).toBeInTheDocument();
  });
  fireEvent.click(screen.getByText('View : Not Responded'));
  fireEvent.click(screen.getByText('All'));
  });

  it('complaint search', async () => {
    // Mock Axios GET request

    render(<ViewComplaints />);
    fireEvent.change(screen.getByPlaceholderText('Search by complaint title'),{
      target: { value: "dev" },
  });
    fireEvent.click(screen.getByText('Search'));
    mock.onGet(`adminstrator/view-complaints/`).reply(200, data);
    fireEvent.click(screen.getByText('Clear'));
  });


  // Add more tests as needed for other functionalities of the ViewComplaints component
});


