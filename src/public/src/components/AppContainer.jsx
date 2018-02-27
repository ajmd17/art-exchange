import * as React from 'react';

import Navbar from './Navbar';

class AppContainer extends React.Component {
  render() {
    return (
      <div className='app-container'>
        <Navbar/>
        <main className='content'>
          {this.props.children}
        </main>
      </div>
    );
  }
}

export default AppContainer;