import * as React from 'react';

import client from '../../services/client';

import PictureItem from './PictureItem';

class UploadImage extends React.Component {
  static propTypes = {
    images: React.PropTypes.arrayOf(React.PropTypes.oneOfType([
      typeof File !== 'undefined'
        ? React.PropTypes.instanceOf(File)
        : React.PropTypes.object,
      React.PropTypes.shape({
        key: React.PropTypes.string
      })
    ])),
    multi: React.PropTypes.bool,
    onImagesSelected: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      images: []
    };
  }

  handleUploadImageClick = () => {
    this.inputElement.click();
  };

  submit() {
    let formData = new FormData();

    this.state.images.forEach((image) => {
      if (image instanceof File) {
        formData.append('images', image);
      }
    });

    const isS3Image = image => !(image instanceof File) && image.key != null;

    return client.assets.uploadImages(formData).then(({ images }) => {
      // resolve with concatenated array of new S3 images, plus old S3 images.
      return [].concat(images, this.state.images.filter(isS3Image));
    }).catch((err) => {
      client.logger.error('Failed to upload images', err);
      throw err;
    });
  }

  renderPictureItem(image) {
    return (
      <PictureItem
        file={image}
        onRemoveClicked={() => {
          const index = this.state.images.indexOf(image);
          this.setState({
            images: [
              ...this.state.images.slice(0, index),
              ...this.state.images.slice(index + 1)
            ]
          }, () => {
            if (typeof this.props.onImagesSelected === 'function') {
              this.props.onImagesSelected(this.state.images);
            }
          });
        }}
      />
    );
  }

  renderPreviews() {
    if (this.state.images != null && this.state.images.length != 0) {
      return (
        <div>
          {this.state.images.map((image) => {
            return (
              <div key={(image instanceof File) ? image.name : image.key}>
                {this.renderPictureItem(image)}
              </div>
            );
          })}
        </div>
      );
    }
  }

  renderUploadButton() {
    return (
      <div>
        <button className='btn' onClick={this.handleUploadImageClick}>
          Upload Image{this.props.multi ? '(s)' : ''}
        </button>
      </div>
    );
  }

  render() {
    return (
      <div className='upload-picture-form'>
        <form ref={form => this.mainForm = form} encType='multipart/form-data'>
          <input
            ref={input => this.inputElement = input}
            type='file'
            name='images'
            accept='image/*'
            multiple={this.props.multi}
            style={{ visibility: 'hidden', position: 'absolute' }}
            onChange={(event) => {
              let newImages = Array.from(event.target.files).filter((el) => {
                let foundIndex = this.state.images != null
                  ? this.state.images.findIndex(x => x.name == el.name)
                  : -1;
                if (foundIndex !== -1) {
                  alert(`Cannot upload image ${el.name}: File already uploaded.`);
                  return false;
                }
                return true;
              });
              this.setState({
                images: this.props.multi
                  ? this.state.images.concat(newImages)
                  : newImages
              }, () => {
                if (typeof this.props.onImagesSelected === 'function') {
                  this.props.onImagesSelected(this.state.images);
                }
              });
            }}
          />
        </form>

        {this.renderPreviews()}
        {this.renderUploadButton()}
      </div>
    );
  }
}

export default UploadImage;