import * as React from 'react';

class IntroHeader extends React.Component {
  render() {
    return (
      <div className='intro-header'>
        <div className='center-panel'>
          <h1>Digital Art Exchange</h1>
          <p>
            Using the power of blockchain to bring properties of physical art into the digital world.<br/>
            art-exchange allows independent artists raise funds and for supporters to trade digital art assets.
          </p>
          <br/>
          <div className='buttons'>
            <a className='btn large' href='#features'>
              Learn More
            </a>
            <a className='btn primary large' href='/trade'>
              View Market
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default IntroHeader;