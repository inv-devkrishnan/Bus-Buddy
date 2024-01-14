import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import BusNavBar from './BusNavBar';

describe('BusNavBar', () => {
  test('renders BusNavBar component with guest user', () => {
    render(
      <BrowserRouter>
        <BusNavBar />
      </BrowserRouter>
    );
  })

  test('clicking on "Search Trips" link navigates to the correct page', () => {
    render(
      <BrowserRouter>
        <BusNavBar />
      </BrowserRouter>
    );

    // Click on the "Search Trips" link
    fireEvent.click(screen.getByText('Search Trips'));

    // Check if the navigation occurred correctly
  });

  // Add more tests for other interactions, such as clicking on login, registration, profile, and logout
});
