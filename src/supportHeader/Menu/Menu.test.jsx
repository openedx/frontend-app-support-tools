import React from 'react';
import '@testing-library/jest-dom';
import {
  render,
  screen,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Menu,
  MenuTrigger,
  MenuContent,
} from './Menu';

jest.mock('react-transition-group', () => ({
  CSSTransition: ({ in: inProp, children }) => (
    inProp ? children : null
  ),
}));

describe('Menu Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders trigger and keeps content hidden by default', () => {
    render(
      <Menu>
        <MenuTrigger>Open Menu</MenuTrigger>
        <MenuContent>Menu Item</MenuContent>
      </Menu>,
    );

    expect(screen.getByText('Open Menu')).toBeInTheDocument();
    expect(screen.queryByText('Menu Item')).not.toBeInTheDocument();
  });

  it('opens menu on trigger click', async () => {
    render(
      <Menu>
        <MenuTrigger>Open Menu</MenuTrigger>
        <MenuContent>Menu Item</MenuContent>
      </Menu>,
    );

    await userEvent.click(screen.getByText('Open Menu'));
    expect(screen.getByText('Menu Item')).toBeInTheDocument();
  });

  it('closes menu on second trigger click', async () => {
    render(
      <Menu>
        <MenuTrigger>Toggle Menu</MenuTrigger>
        <MenuContent>Menu Item</MenuContent>
      </Menu>,
    );

    const trigger = screen.getByText('Toggle Menu');
    await userEvent.click(trigger);
    expect(screen.getByText('Menu Item')).toBeInTheDocument();

    await userEvent.click(trigger);
    await waitFor(() => {
      expect(screen.queryByText('Menu Item')).not.toBeInTheDocument();
    });
  });

  it('calls onOpen and onClose callbacks', async () => {
    const onOpen = jest.fn();
    const onClose = jest.fn();

    render(
      <Menu onOpen={onOpen} onClose={onClose}>
        <MenuTrigger>Trigger</MenuTrigger>
        <MenuContent>Menu Item</MenuContent>
      </Menu>,
    );

    const trigger = screen.getByText('Trigger');

    await userEvent.click(trigger);
    expect(onOpen).toHaveBeenCalled();

    await userEvent.click(trigger);
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('closes when pressing Escape key', async () => {
    render(
      <Menu>
        <MenuTrigger>Trigger</MenuTrigger>
        <MenuContent>
          <button type="button">Focusable Item</button>
        </MenuContent>
      </Menu>,
    );

    fireEvent.click(screen.getByText('Trigger'));
    expect(screen.getByText('Focusable Item')).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole('menu'), {
      key: 'Escape',
      code: 'Escape',
    });

    await waitFor(() => {
      expect(screen.queryByText('Focusable Item')).not.toBeInTheDocument();
    });
  });

  it('opens and closes with mouse enter/leave if respondToPointerEvents=true', async () => {
    render(
      <Menu respondToPointerEvents>
        <MenuTrigger>Hover Me</MenuTrigger>
        <MenuContent>Menu Item</MenuContent>
      </Menu>,
    );

    const trigger = screen.getByText('Hover Me');

    await userEvent.hover(trigger);
    expect(screen.getByText('Menu Item')).toBeInTheDocument();

    await userEvent.unhover(trigger);
    await waitFor(() => {
      expect(screen.queryByText('Menu Item')).not.toBeInTheDocument();
    });
  });

  it('closes on document click outside', async () => {
    render(
      <div>
        <Menu>
          <MenuTrigger>Trigger</MenuTrigger>
          <MenuContent>Menu Item</MenuContent>
        </Menu>
        <button type="button">Outside</button>
      </div>,
    );

    await userEvent.click(screen.getByText('Trigger'));
    expect(screen.getByText('Menu Item')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Outside'));
    await waitFor(() => {
      expect(screen.queryByText('Menu Item')).not.toBeInTheDocument();
    });
  });
});
