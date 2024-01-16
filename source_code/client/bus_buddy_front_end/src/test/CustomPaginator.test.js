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
});
