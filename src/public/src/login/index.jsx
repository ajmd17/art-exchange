import * as React from 'react';
import { browserHistory, Link } from 'react-router';

import auth from '../services/auth';
import client from '../services/client';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailAddressValue: '',
      passwordValue: '',
      errorMessage: null,
      registrationSuccess: false
    };
  }

  componentDidMount() {
    let currentLocation = browserHistory.getCurrentLocation();
    if (currentLocation && currentLocation.query && currentLocation.query.registration_success == '1') {
      this.setState({
        registrationSuccess: true
      });
    }
  }

  handleLoginClick = () => {
    auth.logIn(this.state.emailAddressValue, this.state.passwordValue).then((res) => {
      if (res.error) {
        this.setState({ errorMessage: res.error });
      }
    }).catch((err) => {
      client.logger.error('Failed to log in', err);
      this.setState({ errorMessage: 'Error: ' + JSON.stringify(err) });
    });
  };

  renderError() {
    if (this.state.errorMessage != null) {
      return (
        <p className='error-msg'>
          {this.state.errorMessage}
        </p>
      );
    }
  }

  render() {
    return (
      <div className='login card-view'>
        <h3>Log in to your account</h3>
        <hr/>
        {this.state.registrationSuccess
          ? <div className='success-msg'>
              <img className='success-img' src='/images/success.svg'/>
              <span>Account created successfully! Now, log in.</span>
            </div>
          : null}
        <div className='field'>
          <span>Email address:</span>
          <input
            type='text'
            value={this.state.emailAddressValue}
            onChange={(event) => {
              this.setState({ emailAddressValue: event.target.value });
            }}
          />
        </div>
        <div className='field'>
          <span>Password:</span>
          <input
            type='password'
            value={this.state.passwordValue}
            onChange={(event) => {
              this.setState({ passwordValue: event.target.value });
            }}
          />
        </div>
        <p>
          Registering lets you to track your purchases and connect your GMC wallet (50% off fees!)
        </p>
        <p className='registration-link'>
          Don't have an account?<br/>
          <Link to='/register'>Click here to register.</Link>
        </p>
        {this.renderError()}
        <div className='button-group'>
          <button className='btn'>
            Cancel
          </button>
          <button className='btn primary' onClick={this.handleLoginClick}>
            Log in
          </button>
        </div>
      </div>
    );
  }
}

export default Login;