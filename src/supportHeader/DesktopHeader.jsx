import React from 'react';
import PropTypes from 'prop-types';

// Local Components
import { Dropdown, AvatarButton } from '@edx/paragon';
import { Menu, MenuTrigger, MenuContent } from './Menu';
import { LinkedLogo, Logo } from './Logo';

// Assets
import { CaretIcon } from './Icons';
import ToggleVersion from './ToggleVersion';

export default class DesktopHeader extends React.Component {
  renderMainMenu() {
    const { mainMenu } = this.props;

    // Nodes are accepted as a prop
    if (!Array.isArray(mainMenu)) { return mainMenu; }

    return mainMenu.map((menuItem) => {
      const {
        type,
        href,
        content,
        submenuContent,
      } = menuItem;

      if (type === 'item') {
        return (
          <a key={`${type}-${content}`} className="nav-link" href={href}>{content}</a>
        );
      }

      return (
        <Menu key={`${type}-${content}`} tag="div" className="nav-item" respondToPointerEvents>
          <MenuTrigger tag="a" className="nav-link d-inline-flex align-items-center" href={href}>
            {content} <CaretIcon role="img" aria-hidden focusable="false" />
          </MenuTrigger>
          <MenuContent className="shadow py-2">
            {submenuContent}
          </MenuContent>
        </Menu>
      );
    });
  }

  renderUserMenu() {
    const {
      loggedIn,
      avatar,
      username,
    } = this.props;

    return (
      <>
        <ToggleVersion />
        <Dropdown>
          <Dropdown.Toggle as={AvatarButton} src={avatar}>
            {username}
          </Dropdown.Toggle>

          <Dropdown.Menu alignRight>
            {loggedIn ? this.renderUserMenuItems() : this.renderLoggedOutItems()}
          </Dropdown.Menu>
        </Dropdown>
      </>
    );
  }

  renderUserMenuItems() {
    const { userMenu } = this.props;

    return userMenu.map(({ type, href, content }) => (
      <Dropdown.Item className={`dropdown-${type}`} key={`${type}-${content}`} href={href}>{content}</Dropdown.Item>
    ));
  }

  renderLoggedOutItems() {
    const { loggedOutItems } = this.props;

    return loggedOutItems.map(({ type, href, content }) => (
      <Dropdown.Item className={`dropdown-${type}`} key={`${type}-${content}`} href={href}>{content}</Dropdown.Item>
    ));
  }

  render() {
    const {
      logo,
      logoAltText,
      logoDestination,
    } = this.props;
    const logoProps = { src: logo, alt: logoAltText, href: logoDestination };

    return (
      <header className="site-header-desktop">
        <div className="container-fluid">
          <div className="nav-container position-relative d-flex align-items-center">
            { logoDestination === null ? <Logo className="logo" src={logo} alt={logoAltText} /> : <LinkedLogo className="logo" {...logoProps} />}
            <nav
              aria-label="Main"
              className="nav main-nav"
            >
              {this.renderMainMenu()}
            </nav>
            <nav
              aria-label="Secondary"
              className="nav secondary-menu-container align-items-center ml-auto"
            >
              {this.renderUserMenu()}
            </nav>
          </div>
        </div>
      </header>
    );
  }
}

DesktopHeader.propTypes = {
  mainMenu: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.array,
  ]),
  userMenu: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.oneOf(['item', 'menu']),
    href: PropTypes.string,
    content: PropTypes.string,
  })),
  loggedOutItems: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.oneOf(['item', 'menu']),
    href: PropTypes.string,
    content: PropTypes.string,
  })),
  logo: PropTypes.string,
  logoAltText: PropTypes.string,
  logoDestination: PropTypes.string,
  avatar: PropTypes.string,
  username: PropTypes.string,
  loggedIn: PropTypes.bool,
};

DesktopHeader.defaultProps = {
  mainMenu: [],
  userMenu: [],
  loggedOutItems: [],
  logo: null,
  logoAltText: null,
  logoDestination: null,
  avatar: null,
  username: null,
  loggedIn: false,
};
