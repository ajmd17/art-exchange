import * as React from 'react';

class OrderBook extends React.Component {
  static propTypes = {
    bids: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    asks: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
  };

  groupByPrice = (list, highToLow) => {
    // group by price
    let byPrice = {};

    for (let item of list) {
      if (item.price in byPrice) {
        byPrice[item.price].amount += item.amount;
        byPrice[item.price].count++;
      } else {
        byPrice[item.price] = {
          amount: item.amount,
          count: 1
        };
      }
    }

    // sort by price
    let finalList = [];

    for (let price in byPrice) {
      finalList.push({ price, ...byPrice[price] });
    }

    if (highToLow) {
      finalList.sort((a, b) => Number(b.price) - Number(a.price));
    } else {
      finalList.sort((a, b) => Number(a.price) - Number(a.price));
    }

    return finalList;
  };

  renderList = (list, highToLow) => {
    let listGrouped = this.groupByPrice(list, highToLow);

    return (
      <ul>
        {listGrouped.map((item, index) => {
          return (
            <li key={index}>
              {JSON.stringify(item)}
            </li>
          );
        })}
      </ul>
    );
  };

  render() {
    return (
      <div className='order-book'>
        <div className='bids'>
          {this.renderList(this.bids, true)}
        </div>
        <div className='asks'>
          {this.renderList(this.asks, false)}
        </div>
      </div>
    );
  }
}

export default OrderBook;