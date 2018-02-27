import * as React from 'react';

class IntroHeader extends React.Component {
  render() {
    return (
      <section className='intro-header'>
        <div className='center-panel'>
          <h1>The aggregated crypto exchange</h1>
          <p>
            We aggregate the best bids and offers from the top platforms.
          </p>
          <a className='btn primary large' href='/trade'>
            View Market
          </a>
        </div>
      </section>
    );
  }
}

export default IntroHeader;