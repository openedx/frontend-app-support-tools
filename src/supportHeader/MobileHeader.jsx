import React from 'react';
import PropTypes from 'prop-types';

// Local Components
import { Dropdown, AvatarButton } from '@edx/paragon';
import { Menu, MenuTrigger, MenuContent } from './Menu';
import { LinkedLogo, Logo } from './Logo';

// Assets
import { MenuIcon } from './Icons';
import ToggleVersion from './ToggleVersion';

export default class MobileHeader extends React.Component {
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
          <a key={`${type}-${content}`} className="nav-link" href={href}>
            {content}
          </a>
        );
      }

      return (
        <Menu key={`${type}-${content}`} tag="div" className="nav-item">
          <MenuTrigger tag="a" role="button" tabIndex="0" className="nav-link">
            {content}
          </MenuTrigger>
          <MenuContent className="position-static pin-left pin-right py-2 ml-4">
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
          <Dropdown.Toggle showLabel={false} size="md" as={AvatarButton} src={avatar}>
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
      stickyOnMobile,
      mainMenu,
    } = this.props;
    const logoProps = { src: logo, alt: logoAltText, href: logoDestination };
    const stickyClassName = stickyOnMobile ? 'sticky-top' : '';

    return (
      <header
        aria-label="Main"
        className={`site-header-mobile d-flex justify-content-between align-items-center shadow ${stickyClassName}`}
      >
        <div className="w-100 d-flex justify-content-start">
          {mainMenu.length > 0
            ? (
              <Menu className="position-static">
                <MenuTrigger
                  tag="button"
                  className="icon-button"
                  aria-label="Main Menu"
                  title="Main Menu"
                >
                  <MenuIcon role="img" aria-hidden focusable="false" style={{ width: '1.5rem', height: '1.5rem' }} />
                </MenuTrigger>
                <MenuContent
                  tag="nav"
                  aria-label="Main"
                  className="nav flex-column pin-left pin-right border-top shadow py-2"
                >
                  {this.renderMainMenu()}
                </MenuContent>
              </Menu>
            ) : null }
        </div>
        <div className="w-100 d-flex justify-content-center">
          { logoDestination === null ? <Logo className="logo" src={logo} alt={logoAltText} /> : <LinkedLogo className="logo" {...logoProps} itemType="http://schema.org/Organization" />}
        </div>
        <div className="w-100 d-flex justify-content-end align-items-center">
          {this.renderUserMenu()}
        </div>
      </header>
    );
  }
}

MobileHeader.propTypes = {
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
  stickyOnMobile: PropTypes.bool,
};

MobileHeader.defaultProps = {
  mainMenu: [],
  userMenu: [],
  loggedOutItems: [],
  logo: null,
  logoAltText: null,
  logoDestination: null,
  avatar: null,
  username: null,
  loggedIn: false,
  stickyOnMobile: true,

};
