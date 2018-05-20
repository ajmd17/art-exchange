import * as React from 'react';
import { browserHistory, Link } from 'react-router';

import Dropdown from './Dropdown';
import TradeSelector from './TradeSelector';

// to-do: auto pull coins from supported exchanges.
import supportedCoins from '../data/supported-coins';
import auth from '../services/auth';

const navlinks = [
  { url: '/', name: 'Home', absolute: true },
  { url: '/trade', name: 'Trade' },
  { url: '/account', name: 'Account', loggedIn: true },
  { url: '/login', name: 'Login', loggedIn: false }
]

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hidingDropdown: false,
      showingDropdown: false
    };
  }

  isLinkActive = (url, absolute=false) => {
    if (!browserHistory) {
      return false;
    }

    const { pathname } = browserHistory.getCurrentLocation();

    if (absolute) {
      return url == pathname;
    }

    return pathname.substr(0, url.length) === url;
  };

  handleTradeMouseOver = () => {
    if (!this.state.hidingDropdown) {
      this.setState({ showingDropdown: true });
    }
  };

  renderDropdown() {
    let hideDropdownTimeout = null;

    if (this.state.showingDropdown) {
      return (
        <Dropdown
          hiding={this.state.hidingDropdown}
          dropdownProps={{
            onMouseOver: () => {
              hideDropdownTimeout != null && clearTimeout(hideDropdownTimeout);
            },
            onMouseLeave: () => {
              this.setState({ hidingDropdown: true }, () => {
                hideDropdownTimeout = setTimeout(() => {
                  this.setState({
                    hidingDropdown: false,
                    showingDropdown: false
                  });
                }, 500);
              });
            }
          }}
        >
          <TradeSelector/>
        </Dropdown>
      );
    }
  }

  render() {
    return (
      <nav className='navbar'>
        <a href='/'>
          <h1>artx</h1>
        </a>

        <ul>
          {navlinks.map((navlink, index) => {
            if (typeof navlink.loggedIn === 'undefined' || navlink.loggedIn === auth.isLoggedIn) {
              return (
                <li key={index}>
                  <Link className={this.isLinkActive(navlink) ? 'active' : ''} to={navlink.url}>
                    {navlink.name}
                  </Link>
                </li>
              );
            }
          })}
        </ul>
      </nav>
    );
  }
}

export default Navbar;