import * as React from 'react';

import client from '../../services/client';

import Screen from '../../components/Screen';

class TradeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assetItem: null,
      imageData: null
    };
  }

  componentDidMount() {
    this.loadAsset(this.props.routeParams.assetId);
  }

  componentWillReceiveProps(newProps) {
    if (this.state.assetItem == null || this.state.assetItem._id != newProps.routeParams.assetId) {
      this.loadAsset(newProps.routeParams.assetId);
    }
  }

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

  render() {
    return (
      <Screen className='trade-view' title={this.state.assetItem != null ? this.state.assetItem.title : 'Loading...'}>
        <div className='content'>
          {this.renderImage()}
          <hr/>
          {/* Here is where we will have the charts, order book, etc. */}
        </div>
      </Screen>
    );
  }
}

export default TradeView;