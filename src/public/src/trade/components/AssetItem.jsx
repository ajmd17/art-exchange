import * as React from 'react';

class AssetItem extends React.Component {
  static propTypes = {
    assetItem: React.PropTypes.object.isRequired
  };

  render() {
    return (
      <div className='asset-item'>
        Test Item
      </div>
    );
  }
}

export default AssetItem;