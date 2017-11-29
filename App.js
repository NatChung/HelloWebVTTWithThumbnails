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
  Dimensions
} from 'react-native';

import WebVTTSlider from './src/Component/WebVTTSlider'
import { Dial } from './src/Component/Dial'

export default class App extends Component {

  state = {
    value: 0
  }

  constructor(props){
    super(props)
    this.lastAngleValue = 0
    this.lastRaduis = 0
    this.raduisValue = 0
  }

  onDialComplete() {
    this.refs.webvttslider.onSlidingComplete()
    this.raduisValue = 0
  }

  get xTimeSpeed(){
    return 8
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

    let newSliderValue = this.refs.webvttslider.currentValue + (this._getDialDiffAngle(a)/newTimeSpeed)
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
    this.refs.webvttslider.moveSliderValue(newValue, 1)
    this.setState({
      value: newValue
    }) 
  }

  render() {
    const borderRadius = Dimensions.get('window').width * 0.5
    return (
      <View style={styles.container}>
        <View style={{ width: Dimensions.get('window').width, height: 250, backgroundColor: 'gray' }} />
        <WebVTTSlider ref='webvttslider'
          host={'https://98ab8944.ngrok.io'}
          vttPath={'/earth.vtt'}
          style={{ width: Dimensions.get('window').width, top: -20 }}
          value={this.state.value}/>

        <Dial
          responderStyle={[styles.responderStyle, { borderRadius }]}
          wrapperStyle={styles.wheelWrapper}
          onComplete={this.onDialComplete.bind(this)}
          onValueChange={this._onDialValueChange.bind(this)}
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  responderStyle: {
    top: 20,
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
