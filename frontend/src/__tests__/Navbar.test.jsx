import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../component/Navbar';
import { Authcontext } from '../context';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  BookLock: () => <div data-testid="book-lock-icon">BookLock</div>,
  GalleryThumbnails: () => <div data-testid="gallery-icon">GalleryThumbnails</div>,
  Home: () => <div data-testid="home-icon">Home</div>,
  HomeIcon: () => <div data-testid="home-icon">HomeIcon</div>,
  ProjectorIcon: () => <div data-testid="projector-icon">ProjectorIcon</div>,
  User: () => <div data-testid="user-icon">User</div>,
  UserIcon: () => <div data-testid="user-icon">UserIcon</div>
}));

// Mock react-router-dom Link
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to, className }) => (
    <a href={to} className={className} data-testid={`link-${to || 'default'}`}>
      {children}
    </a>
  )
}));

const mockHandleClick = jest.fn();

const renderNavbar = (user = null) => {
  const mockAuthContextValue = {
    user,
    handleclick: mockHandleClick
  };

  return render(
    <BrowserRouter>
      <Authcontext.Provider value={mockAuthContextValue}>
        <Navbar />
      </Authcontext.Provider>
    </BrowserRouter>
  );
};

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login prompt when user is not authenticated', () => {
    renderNavbar(null);

    expect(screen.getByText('user login')).toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  test('renders navigation when user is authenticated', () => {
    renderNavbar(true);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.queryByText('user login')).not.toBeInTheDocument();
  });

  test('renders all navigation links when authenticated', () => {
    renderNavbar(true);

    expect(screen.getByTestId('link-/')).toBeInTheDocument();
    expect(screen.getByTestId('link-/search')).toBeInTheDocument();
    expect(screen.getByTestId('link-/addpost')).toBeInTheDocument();
    expect(screen.getByTestId('link-/stream')).toBeInTheDocument();
    expect(screen.getByTestId('link-/chat')).toBeInTheDocument();
    expect(screen.getByTestId('link-/profile')).toBeInTheDocument();
  });

  test('renders navigation link texts', () => {
    renderNavbar(true);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Stream')).toBeInTheDocument();
    expect(screen.getByText('chat')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  test('renders icons in navigation links', () => {
    renderNavbar(true);

    expect(screen.getAllByTestId('home-icon')).toHaveLength(2); // HomeIcon appears twice
    expect(screen.getByTestId('projector-icon')).toBeInTheDocument();
    expect(screen.getByTestId('gallery-icon')).toBeInTheDocument();
    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
  });

  test('renders search icon image', () => {
    renderNavbar(true);

    const searchLink = screen.getByTestId('link-/search');
    const searchIcon = searchLink.querySelector('img');
    expect(searchIcon).toBeInTheDocument();
    expect(searchIcon).toHaveAttribute('src', 'https://cdn-icons-png.flaticon.com/128/54/54481.png');
  });

  test('renders add post icon image', () => {
    renderNavbar(true);

    const addPostLink = screen.getByTestId('link-/addpost');
    const addPostIcon = addPostLink.querySelector('img');
    expect(addPostIcon).toBeInTheDocument();
    expect(addPostIcon).toHaveAttribute('src', 'https://cdn-icons-png.flaticon.com/512/3161/3161837.png');
  });

  test('applies correct CSS classes to navigation', () => {
    renderNavbar(true);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('flex', 'w-full', 'px-2', 'sm:px-3', 'py-2', 'fixed', 'bottom-2', 'sm:bottom-4', 'justify-center', 'z-50', 'text-black');
  });

  test('applies correct CSS classes to navigation list', () => {
    renderNavbar(true);

    const navList = screen.getByRole('list');
    expect(navList).toHaveClass('backdrop-blur-md', 'px-3', 'sm:px-4', 'py-2', 'rounded-full', 'shadow-lg', 'flex', 'items-center', 'gap-3', 'sm:gap-5', 'border', 'border-white/10');
  });

  test('applies special styling to add post button', () => {
    renderNavbar(true);

    const addPostLink = screen.getByTestId('link-/addpost');
    expect(addPostLink).toHaveClass('bg-pink-600', 'hover:bg-pink-700', 'rounded-full', 'p-2.5', 'shadow-md');
  });

  test('calls handleclick on mouse leave', () => {
    renderNavbar(true);

    const nav = screen.getByRole('navigation');
    nav.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));

    expect(mockHandleClick).toHaveBeenCalledTimes(1);
  });

  test('renders responsive design elements', () => {
    renderNavbar(true);

    // Check that some elements are hidden on small screens
    const homeText = screen.getByText('Home');
    expect(homeText).toHaveClass('hidden', 'sm:inline');

    const streamText = screen.getByText('Stream');
    expect(streamText).toHaveClass('hidden', 'sm:inline');

    const chatText = screen.getByText('chat');
    expect(chatText).toHaveClass('hidden', 'sm:inline');

    const profileText = screen.getByText('Profile');
    expect(profileText).toHaveClass('hidden', 'sm:inline');
  });
});


