import * as React from 'react';

class IntroNav extends React.Component {
  render() {
    return (
      <nav className='intro-nav'>
        <img className='logo' src='/images/logo.svg'/>
        <h1>multiex</h1>

        <ul>
          <li>
            <a href='/trade'>Trade</a>
          </li>
          <li>
            <a href='/login'>Login</a>
          </li>
        </ul>
      </nav>
    );
  }
}

export default IntroNav;