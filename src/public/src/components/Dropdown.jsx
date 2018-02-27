import * as React from 'react';

class Dropdown extends React.Component {
  static propTypes = {
    hiding: React.PropTypes.bool,
    dropdownProps: React.PropTypes.object
  };

  static defaultProps = {
    dropdownProps: {}
  };

  renderContent() {
    return (
      <div className='arrow'>
        <div className='message-box'>
          {this.props.children}
        </div>
      </div>
    );
  }

  render() {
    let classes = 'dropdown';

    if (this.props.hiding) {
      classes += ' hiding';
    }

    return (
      <div
        className={classes}
        {...this.props.dropdownProps}
      >
        {this.renderContent()}
      </div>
    );
  }
}

export default Dropdown;