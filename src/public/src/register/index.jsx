import * as React from 'react';
import { browserHistory, Link } from 'react-router';

import client from '../services/client';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailAddressValue: '',
      passwordValue: '',
      passwordAgainValue: '',
      errorMessage: null
    };
  }

  validateFields = () => {
    if (this.state.emailAddressValue.trim().length == 0) {
      this.setState({ errorMessage: 'Please enter an email address.' });
      return false;
    }

    if (!/^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\    [\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+(  [a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i
      .test(this.state.emailAddressValue)) {
      this.setState({ errorMessage: 'Please enter a valid email address.' });
      return false;
    }

    if (this.state.passwordValue != this.state.passwordAgainValue) {
      this.setState({ errorMessage: 'The passwords do not match.' });
      return false;
    }

    if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(this.state.passwordValue)) {
      this.setState({ errorMessage: 'A password must contain at least one number, one uppercase letter, one lowercase letter, and consist of 8 or more characters.' });
      return false;
    }

    return true;
  };

  handleSubmitClick = () => {
    if (this.validateFields()) {
      /*auth.logIn(this.state.emailAddressValue, this.state.passwordValue).then((res) => {
        if (res.error) {
          this.setState({ errorMessage: res.error });
        }
      }).catch((err) => {
        console.error(err);
        this.setState({ errorMessage: 'Error: ' + JSON.stringify(err) });
      });*/
      client.account.register({
        email: this.state.emailAddressValue,
        password: this.state.passwordValue
      }).then((res) => {
        if (res.error) {
          this.setState({ errorMessage: res.error });
        } else {
          browserHistory.push('/login?registration_success=1');
        }
      }).catch((err) => {
        console.error(err);
        this.setState({ errorMessage: 'Error: ' + err.response.data.error });
      });
    }
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
        <h3>Create an account</h3>
        <hr/>
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
        <div className='field'>
          <span>Password (again):</span>
          <input
            type='password'
            value={this.state.passwordAgainValue}
            onChange={(event) => {
              this.setState({ passwordAgainValue: event.target.value });
            }}
          />
        </div>
        {this.renderError()}
        <div className='button-group'>
          <button className='btn'>
            Cancel
          </button>
          <button className='btn primary' onClick={this.handleSubmitClick}>
            Submit
          </button>
        </div>
      </div>
    );
  }
}

export default Register;