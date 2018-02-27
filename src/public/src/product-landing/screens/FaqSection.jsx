import * as React from 'react';

class FaqSection extends React.Component {
  render() {
    return (
      <section className='faq-section'>
        <h3>FAQ</h3>
        <ul>
          <li>
            <h4>Can I purchase cards using fiat? (paypal/credit/debit)</h4>
            <hr/>
            <p>
              At least at this time, <strong>no</strong>. We do not act as a brokerage service;
              Instead, you should purchase cryptocurrency using a separate service (such as <a target='_blank' href='http://coinbase.com'>Coinbase</a>), and send the cryptocurrency to the deposit address you're given on our site.
            </p>
          </li>
        </ul>
      </section>
    );
  }
}

export default FaqSection;