import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { Authcontext } from '../context';

// Mock all the components used in App
jest.mock('../Inputes', () => () => <div data-testid="login-component">Login Component</div>);
jest.mock('../Signup', () => () => <div data-testid="signup-component">Signup Component</div>);
jest.mock('../Postpage', () => () => <div data-testid="search-component">Search Component</div>);
jest.mock('../Homepage', () => () => <div data-testid="homepage-component">Homepage Component</div>);
jest.mock('../component/AddPost', () => () => <div data-testid="addpost-component">AddPost Component</div>);
jest.mock('../component/Profile', () => () => <div data-testid="profile-component">Profile Component</div>);
jest.mock('../component/Chatlist', () => () => <div data-testid="chat-component">Chat Component</div>);
jest.mock('../component/Chatbot', () => () => <div data-testid="chatbot-component">Chatbot Component</div>);
jest.mock('../component/Shownav', () => () => <div data-testid="navbar-component">Navbar Component</div>);
jest.mock('../component/StatuV1', () => () => <div data-testid="status-component">Status Component</div>);
jest.mock('../AuthPorvider', () => ({ children }) => <div data-testid="auth-provider">{children}</div>);

const mockAuthContextValue = {
  userprofile: [],
  user: null,
  error: '',
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
  username: null,
  status: [],
  showstatu: false,
  handleStatus: jest.fn(),
  searchdata: [],
  search: jest.fn(),
  handleclick: jest.fn(),
  shownav: false,
  current: null
};

const renderApp = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Authcontext.Provider value={mockAuthContextValue}>
        <App />
      </Authcontext.Provider>
    </MemoryRouter>
  );
};

describe('App Component', () => {
  test('renders homepage by default', () => {
    renderApp('/');

    expect(screen.getByTestId('homepage-component')).toBeInTheDocument();
    expect(screen.getByTestId('navbar-component')).toBeInTheDocument();
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
  });

  test('renders login component on /login route', () => {
    renderApp('/login');

    expect(screen.getByTestId('login-component')).toBeInTheDocument();
    expect(screen.getByTestId('navbar-component')).toBeInTheDocument();
  });

  test('renders signup component on /signup route', () => {
    renderApp('/signup');

    expect(screen.getByTestId('signup-component')).toBeInTheDocument();
    expect(screen.getByTestId('navbar-component')).toBeInTheDocument();
  });

  test('renders search component on /search route', () => {
    renderApp('/search');

    expect(screen.getByTestId('search-component')).toBeInTheDocument();
    expect(screen.getByTestId('navbar-component')).toBeInTheDocument();
  });

  test('renders add post component on /addpost route', () => {
    renderApp('/addpost');

    expect(screen.getByTestId('addpost-component')).toBeInTheDocument();
    expect(screen.getByTestId('navbar-component')).toBeInTheDocument();
  });

  test('renders profile component on /profile route', () => {
    renderApp('/profile');

    expect(screen.getByTestId('profile-component')).toBeInTheDocument();
    expect(screen.getByTestId('navbar-component')).toBeInTheDocument();
  });

  test('renders chat component on /chat route', () => {
    renderApp('/chat');

    expect(screen.getByTestId('chat-component')).toBeInTheDocument();
    expect(screen.getByTestId('navbar-component')).toBeInTheDocument();
  });

  test('renders chatbot component on /chatbot route', () => {
    renderApp('/chatbot');

    expect(screen.getByTestId('chatbot-component')).toBeInTheDocument();
    expect(screen.getByTestId('navbar-component')).toBeInTheDocument();
  });

  test('renders status component on /status/v1 route', () => {
    renderApp('/status/v1');

    expect(screen.getByTestId('status-component')).toBeInTheDocument();
    expect(screen.getByTestId('navbar-component')).toBeInTheDocument();
  });

  test('renders navbar on all routes', () => {
    const routes = ['/', '/login', '/signup', '/search', '/addpost', '/profile', '/chat', '/chatbot', '/status/v1'];

    routes.forEach(route => {
      const { unmount } = renderApp(route);
      expect(screen.getByTestId('navbar-component')).toBeInTheDocument();
      unmount();
    });
  });

  test('wraps all content with AuthProvider', () => {
    renderApp('/');

    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    expect(screen.getByTestId('homepage-component').parentElement).toHaveAttribute('data-testid', 'auth-provider');
  });

  test('applies correct CSS classes to main container', () => {
    renderApp('/');

    const container = screen.getByTestId('auth-provider').querySelector('.bg-white');
    expect(container).toBeInTheDocument();
  });
});


