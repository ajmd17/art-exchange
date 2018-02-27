import * as React from 'react';
import { browserHistory, Link } from 'react-router';

import Dropdown from './Dropdown';
import TradeSelector from './TradeSelector';

// to-do: auto pull coins from supported exchanges.
import supportedCoins from '../data/supported-coins';

const navlinks = [
  { url: '/', name: 'Home', absolute: true },
  { url: '/trade', name: 'Trade' },
  { url: '/login', name: 'Login' }
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
          <img className='logo' src='/images/logo.svg'/>
          <h1>multiex</h1>
        </a>

        <ul>
          <li>
            <Link to='/' className={this.isLinkActive('/', true) ? 'active' : ''}>
              Home
            </Link>
          </li>
          <li>
            <Link to='/trade' className={this.isLinkActive('/') ? 'active' : ''}>
              Trade
            </Link>
            <span>
              <span className='fa fa-caret-down' aria-hidden onMouseOver={this.handleTradeMouseOver}/>
              {this.renderDropdown()}
            </span>
          </li>
          <li>
            <Link to='/login' className={this.isLinkActive('/login') ? 'active' : ''}>
              Login
            </Link>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;