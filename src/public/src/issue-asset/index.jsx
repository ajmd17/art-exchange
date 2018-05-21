import * as React from 'react';

import client from '../services/client';

import Field from '../components/Field';
import Screen from '../components/Screen';
import UploadImage from './components/UploadImage';

class IssueAsset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      titleValue: '',
      descriptionValue: '',
      issuanceAmount: 0,
      images: [],
      statusMessage: null
    };
  }

  uploadImages() {
    console.log('this.state.images.length = ', this.state.images.length);
    if (this.state.images.length == 0) {
      return Promise.resolve([]);
    }

    if (this.uploadPictureForm == null) {
      return Promise.resolve([]);
    }

    return this.uploadPictureForm.submit();
  }

  handleSubmitClick = () => {
    // @TODO Validate fields

    const submissionError = (msg, err) => {
      client.logger.error(msg, err);
      this.setState({
        statusMessage: 'Submission error: ' + msg + ' - ' + err.message
      });
    };

    this.setState({
      statusMessage: 'Uploading images...'
    }, () => {
      this.uploadImages()
      .catch(err => submissionError('Failed to upload images', err))
      .then((images) => {
        return client.assets.submit({
          title: this.state.titleValue,
          description: this.state.descriptionValue,
          totalSupply: parseInt(this.state.issuanceAmount),
          images: images
        }).then(() => {
          this.setState({ statusMessage: 'Submission complete' });
        });
      }).catch(err => submissionError('Failed to submit form', err));
    });
  };
 
  render() {
    return (
      <Screen className='issue-asset' title='Issue Asset'>
        <Field text='Title:'>
          <input
            type='text'
            value={this.state.titleValue}
            onChange={(event) => {
              this.setState({ titleValue: event.target.value });
            }}
          />
        </Field>
        <Field text='Description:'>
          <textarea
            value={this.state.descriptionValue}
            onChange={(event) => {
              this.setState({ descriptionValue: event.target.value });
            }}
          />
        </Field>
        <Field text='Issuance amount:'>
          <input
            type='number'
            value={this.state.issuanceAmount}
            onChange={(event) => {
              this.setState({ issuanceAmount: event.target.value });
            }}
          />
        </Field>
        <h3>Upload Image(s)</h3>
        <hr/>
        <UploadImage
          ref={x => this.uploadPictureForm = x}
          images={this.state.images}
          onImagesSelected={(images) => {
            console.log(' image selected: ', images);
            this.setState({ images: this.state.images.concat(images) });
          }}
        />
        <hr/>
        {this.state.statusMessage !== null
          ? <p className='submitting-msg'>{this.state.statusMessage}</p>
          : null}
        <button className='btn primary' onClick={this.handleSubmitClick}>
          Submit
        </button>
      </Screen>
    );
  }
}

export default IssueAsset;