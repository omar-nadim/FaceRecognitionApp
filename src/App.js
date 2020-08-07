import React from 'react';
import './App.css';
import Navigation from './Components/Navigation/Navigation.js'
import Logo from './Components/Logo/Logo.js'
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm.js'
import Rank from './Components/Rank/Rank.js'
import FaceRecognition from './Components/FaceRecognition/FaceRecognition.js'
import Signin from './Components/Signin/Signin.js'
import Register from './Components/Register/Register.js'
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800, 
      }
    }
  }
}


const app = new Clarifai.App({
 apiKey: 'ffe90c2d7fdd4f40930b1acb643ed9ed'
});

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box:{},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height); 
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow:height - (clarifaiFace.bottom_row * height)   
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box:box});
  } 

  onInputChange = (event) => {
    this.setState({input:event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl:this.state.input})
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout'){
      this.setState({isSignedIn : false})
    } else if (route === 'home'){
      this.setState({isSignedIn : true})
    }
    this.setState({route: route})
  }

  render() {
    return (
      <div className="App">
        <Particles className = 'particles'
          params={particlesOptions} 
        />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        { this.state.route === 'home' 
          ? <div>
              <Logo />
              <Rank />
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
            </div>
          : ( this.state.route === 'signin'
              ? <Signin onRouteChange={this.onRouteChange}/>
              : <Register onRouteChange={this.onRouteChange}/>
            )    
        } 
      </div>
    );
  }
}

export default App;
