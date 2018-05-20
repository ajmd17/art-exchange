import * as React from 'react';

class Roadmap extends React.Component {
  render() {
    return (
      <section>
        <h2>Roadmap</h2>

        <h3>ARTX token distribution</h3>
        <ul>
          <li>Giveaway - first 500 active users receive 500 tokens</li>
          <li>Token sale</li>
          <li>Listing on exchanges</li>
        </ul>
        <h3>Beta platform</h3>
        <ul>
          <li>Building out the beta platform using raised funds</li>
          <li>Beta platform testing - Top 30 active testing participants to receive 5000 tokens each</li>
        </ul>
      </section>
    );
  }
}

export default Roadmap;