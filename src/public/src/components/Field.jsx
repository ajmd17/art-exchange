import * as React from 'react';

class Field extends React.Component {
  static propTypes = {
    text: React.PropTypes.string.isRequired
  };

  render() {
    return (
      <div className='field'>
        <span>{this.props.text}</span>
        {this.props.children}
      </div>
    );
  }
}

export default Field;