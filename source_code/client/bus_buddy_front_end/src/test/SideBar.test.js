import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // for additional matchers
import SideBar from '../components/common/SideBar';

describe('SideBar component', () => {
  it('renders with options', () => {
    const options = [
      { name: 'Option1', onChange: jest.fn(), state: true },
      { name: 'Option2', onChange: jest.fn(), state: false },
    ];

    render(<SideBar options={options} heading="Test Heading" />);

    // Check if heading is rendered
    expect(screen.getByText('Test Heading')).toBeInTheDocument();

    // Check if options are rendered
    options.forEach((option) => {
      expect(screen.getByText(option.name)).toBeInTheDocument();
    });
  });

  it('handles option click', () => {
    const options = [
      { name: 'Option1', onChange: jest.fn(), state: true },
      { name: 'Option2', onChange: jest.fn(), state: false },
    ];

    render(<SideBar options={options} heading="Test Heading" />);

    // Simulate a click on an option
    fireEvent.click(screen.getByText('Option2'));

    // Check if the onChange function was called
    expect(options[1].onChange).toHaveBeenCalled();
  });

  it('renders with options small screen', () => {
    const options = [
      { name: 'Option1', onChange: jest.fn(), state: true },
      { name: 'Option2', onChange: jest.fn(), state: false },
    ];

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

    render(<SideBar options={options} heading="Test Heading" />);
     fireEvent.click(screen.getByText("Menu"));
    // Check if heading is rendered
    expect(screen.getByText('Test Heading')).toBeInTheDocument();

    // Check if options are rendered
    options.forEach((option) => {
      expect(screen.getByText(option.name)).toBeInTheDocument();
    });
  });

});
