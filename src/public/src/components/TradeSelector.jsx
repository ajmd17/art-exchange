import * as React from 'react';
import { browserHistory, Link } from 'react-router';

import Accordion from './Accordion';

class TradeSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openedAccordion: 'Bitcoin'
    };
  }

  render() {
    return (
      <div className='trade-selector'>
        {/* TODO: make this pull dynamic data */}
        <Accordion title='Bitcoin' isOpened={this.state.openedAccordion == 'Bitcoin'} onClick={() => this.setState({ openedAccordion: 'Bitcoin' })}>
          <Link to='/trade/btc-usd'>
            BTC/USD
          </Link>
        </Accordion>
        <Accordion title='Ethereum' isOpened={this.state.openedAccordion == 'Ethereum'} onClick={() => this.setState({ openedAccordion: 'Ethereum' })}>
          <Link to='/trade/eth-usd'>
            ETH/USD
          </Link>
          <Link to='/trade/eth-btc'>
            ETH/BTC
          </Link>
        </Accordion>
        <Accordion title='Litecoin' isOpened={this.state.openedAccordion == 'Litecoin'} onClick={() => this.setState({ openedAccordion: 'Litecoin' })}>
          <Link to='/trade/ltc-usd'>
            LTC/USD
          </Link>
          <Link to='/trade/ltc-btc'>
            LTC/BTC
          </Link>
        </Accordion>
      </div>
    );
  }
}

export default TradeSelector;