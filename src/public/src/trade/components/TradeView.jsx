import * as React from 'react';

import client from '../../services/client';

import AdvancedTrade from './AdvancedTrade'
import Accordion from '../../components/Accordion';
import Screen from '../../components/Screen';
import Field from '../../components/Field';

class TradeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assetItem: null,
      imageData: null,

      buyAmount: 1,
      sellAmount: 1,

      bids: [],
      asks: [],
      balances: {},
      orderBookLoaded: false,

      buyPriceValue: 0,
      customBuyPrice: false,
      sellPriceValue: 0,
      customSellPrice: false
    };
  }

  componentDidMount() {
    const { assetId } = this.props.routeParams;

    this.loadAsset(assetId);
    this.loadOrderBook(assetId);

    client.account.reloadProfileData().then(() => {
      console.log('client.auth.user = ', client.auth.user);
      this.setState({ balances: client.auth.user.balances });
    }).catch((err) => client.logger.error('Failed to load profile data', err));
  }

  componentWillReceiveProps(newProps) {
    if (this.state.assetItem == null || this.state.assetItem._id != newProps.routeParams.assetId) {
      const { assetId } = newProps.routeParams;

      this.loadAsset(assetId);
      this.loadOrderBook(assetId);
    }
  }

  loadOrderBook = (assetId) => {
    client.assets.getOrderBook(assetId).then((data) => {
      const { bids, asks } = data;

      this.setState({
        bids,
        asks,
        buyPriceValue: asks.length != 0 ? asks[0].price : 0,
        sellPriceValue: bids.length != 0 ? bids[0].price : 0,
        orderBookLoaded: true
      });

      // @TODO Subscribe to orderbook websocket feed
    }).catch((err) => client.logger.error('Failed to load order book', err));
  };

  loadAsset = (assetId) => {
    client.assets.get(assetId).then(({ assetItem }) => {
      console.log({assetItem})
      this.setState({
        assetItem
      }, () => {
        if (this.state.assetItem.images.length != 0) {
          client.assets.getImage(this.state.assetItem.images[0].ipfsHash).then((data) => {
            this.setState({
              imageData: data
            });
          }).catch((err) => client.logger.error('Failed to load image', err));
        }
      });
    }).catch((err) => client.logger.error('Failed to load asset', err));
  };

  handleBuyMaxClick = () => {
    this.setState({
      buyAmount: client.auth.isLoggedIn
        ? (this.state.balances['ARTX'] || 0) / (this.state.buyPriceValue)
        : 0
    });
  };

  handleSellMaxClick = () => {
    this.setState({
      sellAmount: client.auth.isLoggedIn
        ? this.state.balances[this.state.assetItem._id] || 0
        : 0
    });
  };

  renderImage() {
   //const backgroundImage = this.state.imageData != null ? `url("data:${this.state.assetItem.images[0].mimeType};base64, ${this.state.imageData}")` : null;
    const imageUrl = this.state.imageData != null ?
      `data:${this.state.assetItem.images[0].mimeType};base64, ${this.state.imageData}`
      : null;

    return (
      <div className='main-image'>
        {this.state.imageData == null
          ? <p className='loading-msg'>Loading...</p>
          : <img src={imageUrl}/>}
      </div>
    );
  }

  renderAccountBalance() {
    if (this.state.assetItem == null) {
      return (
        <p>Loading...</p>
      );
    }

    let assets = [];

    assets.push({ name: 'ARTX', amount: this.state.balances['ARTX'] || 0 });
    assets.push({ name: this.state.assetItem.title, amount: this.state.balances[this.state.assetItem._id] || 0 });

    return (
      <div>
        {assets.map((asset, index) => (
          <div key={index}>
            <strong>{asset.name}:</strong> {asset.amount}
          </div>
        ))}
      </div>
    );
  }

  render() {
    return (
      <Screen className='trade-view' title={this.state.assetItem != null ? this.state.assetItem.title : 'Loading...'}>
        <div className='content'>
          {this.renderImage()}
          <hr/>

          <Accordion title='Advanced View'>
            {this.state.orderBookLoaded
              ? <AdvancedTrade
                  assetItem={this.state.assetItem}
                  bids={this.state.bids}
                  asks={this.state.asks}
                />
              : <p>Loading advanced view...</p>}
          </Accordion>

          <hr/>

          <div className='buy-sell'>
            <div className='buy-side'>
              <button className='btn buy'>
                Buy <strong>{this.state.buyAmount}</strong>
                <small>
                  {!this.state.buyPriceValue
                    ? 'No buy price specified'
                    : `@ ${this.state.buyPriceValue} ARTX each`}
                </small>
              </button>

              {client.auth.isLoggedIn
                ? <div className='available-count'>
                    {this.state.balances['ARTX'] || 0} ARTX in account
                  </div>
                : null}

              <Field text='Buy amount:'>
                <input
                  type='number'
                  value={this.state.buyAmount}
                  onChange={(event) => this.setState({ buyAmount: event.target.value })}
                />
                <button className='btn' onClick={this.handleBuyMaxClick}>
                  Max
                </button>
              </Field>

              <Field text='Buy price (per item)'>
                <input
                  type='number'
                  value={this.state.buyPriceValue}
                  onChange={(event) => this.setState({ buyPriceValue: event.target.value, customBuyPrice: true })}
                />
              </Field>

            </div>
            <div className='sell-side'>
              <button className='btn sell'>
                Sell <strong>{this.state.sellAmount}</strong>
                <small>
                  {!this.state.sellPriceValue
                    ? 'No sell price specified'
                    : ` @ ${this.state.sellPriceValue} ARTX each`}
                </small>
              </button>

              {client.auth.isLoggedIn
                ? <div className='available-count'>
                    {this.state.assetItem != null
                      ? `${this.state.balances[this.state.assetItem._id] || 0} copies in account`
                      : null} 
                  </div>
                : null}

              <Field text='Sell amount:'>
                <input
                  type='number'
                  value={this.state.sellAmount}
                  onChange={(event) => this.setState({ sellAmount: event.target.value })}
                />
                <button className='btn' onClick={this.handleSellMaxClick}>
                  Max
                </button>
              </Field>

              <Field text='Sell price (per item)'>
                <input
                  type='number'
                  value={this.state.sellPriceValue}
                  onChange={(event) => this.setState({ sellPriceValue: event.target.value, customSellPrice: true })}
                />
              </Field>
            </div>
          </div>
          {/* Here is where we will have the charts, order book, etc. */}
        </div>
      </Screen>
    );
  }
}

export default TradeView;