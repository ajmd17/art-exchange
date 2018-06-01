import * as React from 'react';

import OrderBook from './OrderBook';

class AdvancedTrade extends React.Component {
  static propTypes = {
    assetItem: React.PropTypes.object.isRequired,
    bids: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    asks: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className='advanced-trade'>

      </div>
    );
  }
}

export default AdvancedTrade;