import * as React from 'react';

import Screen from '../../components/Screen';

import ByVolumeSection from './ByVolumeSection';

class TradeHome extends React.Component {
  renderButtons() {
    return [
      <a className='btn primary issue-asset' href='/issue'>Issue New Asset</a>
    ];
  }

  render() {
    // TODO: pull this data dynamically using a service on the backend to aggregate trading pairs.
    return (
      <Screen className='trade-home' title='Marketplace' buttons={this.renderButtons()}>
        {/* @TODO: render "top" items in the marketplace, by volume. */}
        {/* We will have a sidebar that allows you to browse by category, or by creator. Favorites / subscribed creators could be a thing too */}
        <ByVolumeSection/>
      </Screen>
    );
  }
}

export default TradeHome;