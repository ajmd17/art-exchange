import * as React from 'react';

class HowItWorks extends React.Component {
  render() {
    return (
      <section className='how-it-works'>
        <h3>How does it work?</h3>
        <div className='part'>
          <div className='circle left'>
            <img src='/images/lock.svg'/>
          </div>

          <p>
            In your browser, GiftMeCrypto generates a new wallet for whatever cryptocurrency you choose.
            <br/>
            The wallet's private key is secured using a <strong>secret code word</strong> that you will share with the person you're giving the gift card to.<br/>
            This secret code word is not stored on our physical cards, nor does it pass through our systems, ensuring that the funds cannot not accessed by us or any other third-party.
          </p>
        </div>
        <div className='part'>
          <div className='circle right'>
            <img src='/images/money.svg'/>
          </div>

          <p>
            Once the wallet has been created, we'll provide an address that you can send funds to.<br/>
            We charge a small processing fee based on the amount that will be held on the card (larger amounts = smaller fees).<br/>
            Fees are reduced by 50% if you use our GMC token to pay for fees.
          </p>
        </div>
        <div className='part'>
          <div className='circle left'>
            <img src='/images/lock.svg'/>
          </div>

          <p>
            Once funds are sent, we will 
          </p>
        </div>
      </section>
    );
  }
}

export default HowItWorks;