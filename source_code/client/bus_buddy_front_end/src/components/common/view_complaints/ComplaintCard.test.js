import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ComplaintCard from './ComplaintCard';

const mockComplaint = {
  id: 1,
  complaint_title: 'Test Complaint',
  user: { first_name: 'Test User' },
  created_date: '2022-01-11',
  status: 0,
  complaint_body: 'Test Complaint Body',
};

describe('ComplaintCard component', () => {
  

  it('renders with given props', () => {
    render(
      <ComplaintCard
        complaint={mockComplaint}
        getComplaintsbyPage={() => {}}
        currentPage={1}
        complaintListLenght={1}
        hasPrevious={false}
      />
    );
    // Check if the ComplaintCard component is rendered
    // Check if complaint title and user name are displayed
    expect(screen.getByText('Test Complaint')).toBeInTheDocument();
    expect(screen.getByText('From Test User')).toBeInTheDocument();

    // Check if the "View Details" button is rendered
    expect(screen.getByText('View Details')).toBeInTheDocument();
  });

  it('opens modal on "View Details" button click', () => {
    render(
      <ComplaintCard
        complaint={mockComplaint}
        getComplaintsbyPage={() => {}}
        currentPage={1}
        complaintListLenght={1}
        hasPrevious={false}
      />
    );

    // Simulate clicking the "View Details" button
    fireEvent.click(screen.getByText('View Details'));

    // Check if the modal is opened
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('sends response on form submission', async () => {
    // Mock Axios PUT request
    render(
      <ComplaintCard
        complaint={mockComplaint}
        getComplaintsbyPage={() => {}}
        currentPage={1}
        complaintListLenght={1}
        hasPrevious={false}
      />
    );

    // Simulate clicking the "View Details" button
    fireEvent.click(screen.getByText('View Details'));

    // Check if the "Send Response" button is rendered
    expect(screen.getByText('Send Response')).toBeInTheDocument();

    // Simulate submitting the response form
    fireEvent.submit(screen.getByText('Send Response'));

    // Wait for the Axios request to complete
  });
});
