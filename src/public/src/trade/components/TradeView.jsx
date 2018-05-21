import * as React from 'react';

import client from '../../services/client';

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
        client.assets.getImage(this.state.assetItem.imageHashes[0]).then((data) => {
          console.log('data = ', data);
          this.setState({
            imageData: data
          });
        }).catch((err) => client.logger.error('Failed to load image', err));
      });
    }).catch((err) => client.logger.error('Failed to load asset', err));
  };

  render() {
    return (
      <div className='trade-view'>
        {this.state.imageData != null
          ? <img src={`base64:${this.state.imageData}`}/>
          : null}
        {/* Here is where we will have the charts, order book, etc. */}
      </div>
    );
  }
}

export default TradeView;