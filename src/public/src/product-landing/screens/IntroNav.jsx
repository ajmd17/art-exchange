import * as React from 'react';

class IntroNav extends React.Component {
  render() {
    return (
      <nav className='intro-nav'>
        <h1>artx</h1>

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