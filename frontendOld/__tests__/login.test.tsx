/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/(auth)/login/page';
import { useAuth } from '@/context/AuthContext';

// Mock AuthContext
jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const mockLogin = jest.fn();

describe('LoginPage Integration Test', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form correctly', () => {
    render(<LoginPage />);

    expect(screen.getByText('Тавтай морил')).toBeInTheDocument();
    // placeholder ашиглаж шалгана
    expect(screen.getByPlaceholderText('example@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Нэвтрэх' })).toBeInTheDocument();
  });

  test('calls login when form submitted', async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText('example@email.com'), {
      target: { value: 'bat@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Нэвтрэх' }));

    await waitFor(() => {
      // энд "bat@example.com" гэж тааруулна
      expect(mockLogin).toHaveBeenCalledWith('bat@example.com', 'password123');
    });
  });

  test('shows error message when login fails', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Нууц үг буруу'));

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText('example@email.com'), {
      target: { value: 'user@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Нэвтрэх' }));

    await waitFor(() => {
      expect(screen.getByText('Нууц үг буруу')).toBeInTheDocument();
    });
  });

  test('shows loading state while logging in', async () => {
    mockLogin.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 500))
    );

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText('example@email.com'), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Нэвтрэх' }));

    // Loading text харагдаж байгаа эсэх
    expect(screen.getByText('Нэвтэрч байна...')).toBeInTheDocument();
  });
});
