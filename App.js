/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  StatusBar
} from 'react-native';

import WebVTTSlider from './src/Component/WebVTTSlider'
import { Dial } from './src/Component/Dial'
import Video from 'react-native-video'
import { Toolbar, COLOR, ThemeProvider } from 'react-native-material-ui'

export default class App extends Component {

  state = {
    value: 0,
    paused: false,
    previewHidden: true
  }

  get xTimeSpeed(){
    return 8
  }

  constructor(props){
    super(props)
    this.lastAngleValue = 0
    this.lastRaduis = 0
  }

  onDialComplete() {
    this.raduisValue = 0
    this.player.seek(this.state.value * this.duration)
    this.setState({
      paused: false,
      previewHidden: true
    })
  }

  onSlidingCompleteWithValue(value){
    this.player.seek(value * this.duration)
    this.setState({
      value: value,
      paused: false,
      previewHidden: true
    })
  }

  onSlidingStart(){

    this.setState({
      paused: true,
      previewHidden: false
    })
    
  }

  onDialStart() {
    this.setState({
      previewHidden: false,
      paused: true
    })
  }


  _getDialDiffAngle(a){
    let angleValue = a % 360 / 360
    let newAngleDiff = angleValue - this.lastAngleValue
    this.lastAngleValue = angleValue
    if(Math.abs(newAngleDiff) > 0.9){
      newAngleDiff += (newAngleDiff > 0) ? -1 : 1
    }

    return newAngleDiff
  }

  _getNewSliderValue(a, raduisValue){

    let newTimeSpeed = (raduisValue > 0.7) ? 1 : this.xTimeSpeed

    let newSliderValue = this.slider.currentValue + (this._getDialDiffAngle(a)/newTimeSpeed)
    if(newSliderValue < 0)
      newSliderValue = 0
    else if(newSliderValue > 1)
      newSliderValue = 1

    return newSliderValue
  }

  _getDiffRadius(r){
    let diffRadius = r - this.lastRaduis
    this.lastRaduis = r
    return diffRadius
  }

  _onDialValueChange(a, r) {

    this.raduisValue += this._getDiffRadius(r)
    let newValue = this._getNewSliderValue(a, this.raduisValue)
    this.slider.moveSliderValue(newValue)
    this.setState({
      value: newValue
    }) 
  }

  onVideoLoaded(data){
    this.duration = data.duration
  }

  onVideoProgress(data){
    this.setState({value: data.currentTime/this.duration})
  }

  render() {
    const borderRadius = Dimensions.get('window').width * 0.5
    return (
      <ThemeProvider uiTheme={uiTheme}>
      <StatusBar backgroundColor="#396CD2" barStyle="light-content" />
      <Toolbar />
      <View style={styles.container}>
        <Video source={{uri: "https://s3-ap-northeast-1.amazonaws.com/sv-doorbell-demo/playback/hls2/index.m3u8"}}   // Can be a URL or a local file.
          ref={ref => this.player = ref} 
          paused={this.state.paused}
          onLoad={this.onVideoLoaded.bind(this)}
          onProgress={this.onVideoProgress.bind(this)}
          style={{ width: Dimensions.get('window').width, height: 250, backgroundColor: 'gray' }}/>

        <WebVTTSlider ref={ref => this.slider = ref}
          host={'https://s3-ap-northeast-1.amazonaws.com/sv-doorbell-demo/playback'}
          vttPath={'/earth2.vtt'}
          previewHidden={this.state.previewHidden}
          style={{ width: Dimensions.get('window').width, top: -30 }}
          value={this.state.value}
          onSlidingStart={this.onSlidingStart.bind(this)}
          onSlidingCompleteWithValue={this.onSlidingCompleteWithValue.bind(this)} />

        <Dial
          responderStyle={[styles.responderStyle, { borderRadius }]}
          wrapperStyle={styles.wheelWrapper}
          onComplete={this.onDialComplete.bind(this)}
          onStart={this.onDialStart.bind(this)}
          onValueChange={this._onDialValueChange.bind(this)}
        />

      </View>
      </ThemeProvider>
    );
  }
}

const uiTheme = {
  palette: {
      primaryColor: '#396CD2',
  },
  toolbar: {
      container: {
          height: (Platform.OS === 'ios') ? 64 : 50,
      },
  },
};

const styles = StyleSheet.create({
  responderStyle: {
    top: 60,
    backgroundColor: 'white',
    elevation: 1,
    shadowColor: 'rgba(0,0,0,.7)',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 1
  },
  wheelWrapper: {
    borderRadius: 120,
    elevation: 5,
    padding: 0,
    shadowColor: 'rgba(0,0,0,.7)',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    zIndex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
