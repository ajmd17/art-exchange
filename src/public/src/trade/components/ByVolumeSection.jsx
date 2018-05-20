import * as React from 'react';

import client from '../../services/client';

import AssetItem from './AssetItem';

class ByVolumeSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assets: null
    };
  }

  componentDidMount() {
    client.assets.getAll('volume').then((assets) => {
      this.setState({
        assets
      });
    });
  }

  renderAssets() {
    if (this.state.assets == null) {
      return (
        <p>Loading assets...</p>
      );
    }

    if (this.state.assets.length == 0) {
      return (
        <p>No assets to show.</p>
      );
    }

    return (
      <ul>
        {this.state.assets.map((asset, index) => {
          return (
            <li key={index}>
              <AssetItem assetItem={asset}/>
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    return (
      <section className='market-section'>
        <h3>By volume</h3>

        {this.renderAssets()}
      </section>
    );
  }
}

export default ByVolumeSection;