import * as React from 'react';

class TradeHome extends React.Component {
  render() {
    // TODO: pull this data dynamically using a service on the backend to aggregate trading pairs.
    return (
      <div className='trade-home'>
        <h1>Cryptocurrency Trading Pairs</h1>
        <ul>
          <li>
            <div className='content'>
              <h3>Bitcoin</h3>
              {/* TODO: display prices, percentage changes, volumes, etc. */}

              <a href='/trade/btc-usd'>BTC/USD</a>
            </div>
          </li>
          <li>
            <div className='content'>
              <h3>Ethereum</h3>

              <a href='/trade/eth-usd'>ETH/USD</a>
              <a href='/trade/eth-btc'>ETH/BTC</a>
            </div>
          </li>
          <li>
            <div className='content'>
              <h3>Litecoin</h3>

              <a href='/trade/ltc-usd'>LTC/USD</a>
              <a href='/trade/ltc-btc'>LTC/BTC</a>
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

export default TradeHome;