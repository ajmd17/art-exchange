import * as React from 'react';

class TradeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assetItem: null
    };
  }

  componentDidMount() {
    console.log(this.props);
  }

  render() {
    return (
      <div className='trade-view'>
        {/* Here is where we will have the charts, order book, etc. */}
      </div>
    );
  }
}

export default TradeView;