import React, { Component } from 'react'
import NavigationBar from './components/NavigationBar'
import authenticate from './lib/Wallet'
import handleUpload from './prototypeJsClient/OwnerClient.js'

export class App extends Component {

  constructor(props) {
    super(props);
    this.onConnectButtonClick = this.onConnectButtonClick.bind(this);
    this.onPrototypeUpload = this.onPrototypeUpload.bind(this);
  }

  state = {
    provider: undefined
  };

  onConnectButtonClick = () => {
    console.log("Connect Button Clicked");
    authenticate().then(provider => {
      // console.log(provider);
      this.setState({
        "provider": provider
      });
      // console.log(this.state);
    })
      .catch(error => {
        console.error(error);
      })
  }

  onPrototypeUpload = fileUploadEvent => {
    handleUpload(this.state.provider, fileUploadEvent.target.files[0]);
  }

  render() {
    return (
      <React.Fragment>
        <NavigationBar onConnectButtonClick={this.onConnectButtonClick} />
        <input type="file" onChange={this.onPrototypeUpload} />
      </React.Fragment>
    )
  }
}

export default App
