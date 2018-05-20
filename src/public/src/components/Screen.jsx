import * as React from 'react';

class Screen extends React.Component {
  static propTypes = {
    className: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    buttons: React.PropTypes.arrayOf(React.PropTypes.element.isRequired)
  };

  render() {
    return (
      <div className={`screen${this.props.className ? ` ${this.props.className}` : ''}`}>
        <div className='title'>
          <h1>{this.props.title}</h1>
          {this.props.buttons && this.props.buttons.length
            ? <ul className='button-group'>
                {this.props.buttons.map((button, index) => {
                  return (
                    <li key={index}>
                      {button}
                    </li>
                  );
                })}
              </ul>
            : null}
        </div>
        <hr/>
        {this.props.children}
      </div>
    );
  }
}

export default Screen;