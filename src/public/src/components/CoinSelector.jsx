import * as React from 'react';
import { Link } from 'react-router';

import supportedCoins from '../data/supported-coins';

class CoinSelector extends React.Component {
  static propTypes = {
    getCoinUrl: React.PropTypes.func.isRequired
  };

  render() {
    return (
      <div className='coin-selector'>
        <ul>
          {supportedCoins.map((coin, index) => {
            return (
              <li key={coin.symbol}>
                <Link to={this.props.getCoinUrl(coin.symbol.toLowerCase())}>
                  <img src={`/images/coins/${coin.symbol.toLowerCase()}.svg`}/>
                  <span>{coin.name} ({coin.symbol})</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default CoinSelector;