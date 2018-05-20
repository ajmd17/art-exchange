import * as React from 'react';

class AssetItem extends React.Component {
  static propTypes = {
    assetItem: React.PropTypes.object.isRequired
  };

  render() {
    // @TODO: Get last sold price
    return (
      <div className='asset-item'>
        <div><strong>{this.props.assetItem.title}</strong></div>
        <p>{this.props.assetItem.description}</p>
        {/* @TODO: image preview */}
        <hr/>
        <a className='btn primary small' href={`/trade/asset/${this.props.assetItem._id}`}>
          View Market
        </a>
      </div>
    );
  }
}

export default AssetItem;