import React from 'react';
import { render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ComplaintCard from '../components/common/view_complaints/ComplaintCard';
import { axiosApi } from '../utils/axiosApi';
import MockAdapter from "axios-mock-adapter";

let mock;
beforeEach(() => {
  mock = new MockAdapter(axiosApi);
});

afterEach(() => {
  mock.restore();
});
let mockComplaint = {
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
        getComplaintsbyPage={() => { }}
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

  it('renders responded complaint', () => {
    let mockComplaint = {
      id: 1,
      complaint_title: 'Test Complaint',
      user: { first_name: 'Test User' },
      created_date: '2022-01-11',
      status: 1,
      complaint_body: 'Test Complaint Body',
      complaint_image: 'deft',
    };
    render(
      <ComplaintCard
        complaint={mockComplaint}
        getComplaintsbyPage={() => { }}
        currentPage={1}
        complaintListLenght={1}
        hasPrevious={false}
      />
    );
  });

  it('opens modal on "View Details" button click', () => {
    render(
      <ComplaintCard
        complaint={mockComplaint}
        getComplaintsbyPage={() => { }}
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
        getComplaintsbyPage={() => { }}
        currentPage={1}
        complaintListLenght={1}
        hasPrevious={false}
      />
    );

    // Simulate clicking the "View Details" button
    fireEvent.click(screen.getByText('View Details'));

    // Check if the "Send Response" button is rendered
    const textareaElement = screen.getByRole('textbox');

    // Triggering a change event with a new value
    fireEvent.input(textareaElement, { target: { value: '' } });
    // Simulate submitting the response form
    fireEvent.submit(screen.getByText('Send Response'));
    fireEvent.input(textareaElement, { target: { value: 'fsdffsdffs' } });
    fireEvent.submit(screen.getByText('Send Response'));
    mock.onPut(`adminstrator/respond-complaint/1/`).reply(200);


  });

  it('invalid form submission', async () => {
    // Mock Axios PUT request
    render(
      <ComplaintCard
        complaint={mockComplaint}
        getComplaintsbyPage={() => { }}
        currentPage={1}
        complaintListLenght={1}
        hasPrevious={false}
      />
    );

    // Simulate clicking the "View Details" button
    fireEvent.click(screen.getByText('View Details'));

    // Check if the "Send Response" button is rendered
    const textareaElement = screen.getByRole('textbox');

    // Triggering a change event with a new value
    fireEvent.input(textareaElement, { target: { value: '' } });
    // Simulate submitting the response form
    fireEvent.submit(screen.getByText('Send Response'));
    fireEvent.input(textareaElement, { target: { value: '12' } });
    fireEvent.submit(screen.getByText('Send Response'));

  });

  it('sends response on form submission multiple complaints', async () => {
    // Mock Axios PUT request
    render(
      <ComplaintCard
        complaint={mockComplaint}
        getComplaintsbyPage={() => { }}
        currentPage={1}
        complaintListLenght={2}
        hasPrevious={false}
      />
    );

    // Simulate clicking the "View Details" button
    fireEvent.click(screen.getByText('View Details'));

    // Check if the "Send Response" button is rendered
    const textareaElement = screen.getByRole('textbox');
    fireEvent.change(textareaElement, { target: { value: 'fsdffsdffsdfdsfsdfdfs' } });
    fireEvent.submit(screen.getByText('Send Response'));
    mock.onPut(`adminstrator/respond-complaint/1/`).reply(200);


  });

  it('sends response on form submission multiple complaints has previous', async () => {
    // Mock Axios PUT request
    render(
      <ComplaintCard
        complaint={mockComplaint}
        getComplaintsbyPage={() => { }}
        currentPage={1}
        complaintListLenght={1}
        hasPrevious={true}
      />
    );

    // Simulate clicking the "View Details" button
    fireEvent.click(screen.getByText('View Details'));

    // Check if the "Send Response" button is rendered
    const textareaElement = screen.getByRole('textbox');
    fireEvent.change(textareaElement, { target: { value: 'fsdffsdffsdfdsfsdfdffsdets' } });
    fireEvent.submit(screen.getByText('Send Response'));
    mock.onPut(`adminstrator/respond-complaint/1/`).reply(200);


  });

  it('sends response on form submission fail 1', async () => {
    // Mock Axios PUT request
    render(
      <ComplaintCard
        complaint={mockComplaint}
        getComplaintsbyPage={() => { }}
        currentPage={1}
        complaintListLenght={1}
        hasPrevious={false}
      />
    );

    // Simulate clicking the "View Details" button
    fireEvent.click(screen.getByText('View Details'));

    // Check if the "Send Response" button is rendered
    const textareaElement = screen.getByRole('textbox');
    fireEvent.change(textareaElement, { target: { value: 'fsdffsdffs' } });
     fireEvent.submit(screen.getByText('Send Response'));
    mock.onPut(`adminstrator/respond-complaint/1/`).reply(200, { error_code: "1023" });
    fireEvent.submit(screen.getByText('Send Response'));
    mock.onPut(`adminstrator/respond-complaint/1/`).reply(400);
  });
  it('sends response on form submission fail 2', async () => {
    // Mock Axios PUT request
    render(
      <ComplaintCard
        complaint={mockComplaint}
        getComplaintsbyPage={() => { }}
        currentPage={1}
        complaintListLenght={1}
        hasPrevious={false}
      />
    );

    // Simulate clicking the "View Details" button
    fireEvent.click(screen.getByText('View Details'));

    // Check if the "Send Response" button is rendered
    const textareaElement = screen.getByRole('textbox');
    fireEvent.change(textareaElement, { target: { value: 'fsdffsdffs' } });
     fireEvent.submit(screen.getByText('Send Response'));
    mock.onPut(`adminstrator/respond-complaint/1/`).reply(200, { error_code: "1023" });
  });
});
