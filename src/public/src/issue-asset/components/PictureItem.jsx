import * as React from 'react';


class PictureItem extends React.Component {
  static propTypes = {
    file: React.PropTypes.oneOfType([
      typeof File !== 'undefined'
        ? React.PropTypes.instanceOf(File)
        : React.PropTypes.object,
      // S3 file
      React.PropTypes.shape({
        key: React.PropTypes.string
      })
    ]).isRequired,
    onRemoveClicked: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      imagePreviewUrl: null
    };
  }
  
  componentDidMount() {
    if (this.props.file instanceof File) {
      let fileReader = new FileReader();

      fileReader.onload = (event) => {
        this.setState({
          imagePreviewUrl: event.target.result
        });
      };

      fileReader.readAsDataURL(this.props.file);
    } else {
      // this.setState({
      //   imagePreviewUrl: `${Config.S3_URL}/${this.props.file.key}`
      // });
    }
  }

  renderPreview() {
    if (this.state.imagePreviewUrl == null) {
      // return (
      //   <LoadingMessage text='Loading preview...'/>
      // );
      return null;
    }

    return (
      <div className='img' style={{ backgroundImage: `url("${this.state.imagePreviewUrl}")`}}/>
    );
  }

  render() {
    return (
      <div className='picture-item'>
        {this.renderPreview()}

        <div className='delete-overlay'>
          <button className='btn' onClick={this.props.onRemoveClicked}>
            Remove
          </button>
        </div>
      </div>
    );
  }
}

export default PictureItem;