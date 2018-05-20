import * as React from 'react';

import client from '../services/client';

import Screen from '../components/Screen';
import UploadImage from './components/UploadImage';

class IssueAsset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      statusMessage: null
    };
  }

  uploadImages() {
    if (this.uploadPictureForm == null) {
      return Promise.resolve([]);
    }

    return this.uploadPictureForm.submit();
  }

  handleSubmitClick = () => {
    this.setState({
      statusMessage: 'Uploading images...'
    }, () => {
      this.uploadImages()
      .catch(err => client.logger.error('Failed to upload images', err))
      .then((images) => {
        console.log('images: ', images);
      });
    });
  };
 
  render() {
    return (
      <Screen className='issue-asset' title='Issue Asset'>
        <UploadImage
          ref={x => this.uploadPictureForm = x}
          images={this.state.images}
          onImagesSelected={(images) => {
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