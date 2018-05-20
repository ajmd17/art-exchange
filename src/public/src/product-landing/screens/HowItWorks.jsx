import * as React from 'react';

class HowItWorks extends React.Component {
  render() {
    return (
      <section id='features' className='how-it-works'>
        <h2>Features</h2>

        <div className='part'>
          <h3>Tradable digital art pieces</h3>
          <p>Digital art assets are stored on the blockchain to cryptographically prove ownership.<br/>Ownership of a particular art piece may be sold to someone else through the exchange.<br/>Original artists will also be able to receive a percentage of trading fees when the piece is bought or sold.</p>
          {/* <h3>Issue a limited run of an art piece.</h3> */}
          {/* <p>If you want to issue only 100 copies, then only 100 copies will ever be able to exist due to the nature of the blockchain.</p> */}
        </div>

        <div className='part'>
          <h3>Raise funds via an &ldquo;initial art offering&rdquo;</h3>
          <p>
            As an artist, you may issue a limited run of an art piece to your followers. If you issue 100 copies, only 100 copies will <strong>ever</strong> exist, due to the nature of the blockchain.
            <br/>
            As a follower and supporter of an artist, you may participate in the IAO (Initial Art Offering) by purchasing a piece of art using the ARTX token. You may then trade the art piece for ARTX tokens on the online exchange, when it is made available.
          </p>
        </div>

        <div className='part'>
          <h3>ARTX token</h3>
          <p>
            The artx online exchange is powered by the <strong>ARTX</strong> token.<br/>
            Using this token allows users to participate in IAOs and purchase pieces of art on the exchange, and for artists to raise funds for their art pieces.<br/>
            You may also cash-out your ARTX tokens by trading them for other coins such as Ethereum.
          </p>
        </div>
      </section>
    );
  }
}

export default HowItWorks;