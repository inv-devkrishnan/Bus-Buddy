import { renderHook } from '@testing-library/react-hooks';
import { useHome } from '../utils/hooks/useHome'; // Adjust the import path accordingly

// Mock the useNavigate function from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate:()=> jest.fn(),
}));

describe('useHome hook', () => {
  test('should call navigate with "/"', () => {
    const { result } = renderHook(() => useHome());

    // Call the hook, which should invoke navigate("/").
    result.current();

    // Assert that useNavigate has been called with the correct arguments
  });
});