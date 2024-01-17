import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CustomPaginator from '../components/common/paginator/CustomPaginator';


describe('CustomPaginator component', () => {
 
  it('calls viewPage function on page change', () => {
    const viewPageMock = jest.fn();

    render(
      <CustomPaginator totalPages={10} currentPage={5} viewPage={viewPageMock} />
    );

    // Simulate changing the page
    fireEvent.click(screen.getByText('6'));

    // Check if the viewPage function is called with the correct arguments
    expect(viewPageMock).toHaveBeenCalledWith(6);
  });

  it('calls viewPage function on page change small device', () => {
    const viewPageMock = jest.fn();
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 400, // Set the desired width
    });
  
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 400, // Set the desired height
    });
    render(
      <CustomPaginator totalPages={10} currentPage={5} viewPage={viewPageMock} />
    );

    // Simulate changing the page
    fireEvent.click(screen.getByText('6'));

    // Check if the viewPage function is called with the correct arguments
   
  });
});
