import * as React from 'react';

class Field extends React.Component {
  static propTypes = {
    text: React.PropTypes.string.isRequired
  };

  render() {
    return (
      <div className='field'>
        <span>{this.props.text}</span>
        <div className='content'>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Field;