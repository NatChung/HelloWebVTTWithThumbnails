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

  onDialComplete() {
    this.refs.webvttslider.onSlidingComplete()
  }

  onvaluechange(a, r) {
    this.refs.webvttslider.onSliderValueChange(a % 360 / 360)
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
          value={this.state.value} />

        <Dial
          style={{ width: 150, height: 150, borderRadius: 75 }}
          responderStyle={[styles.responderStyle, { borderRadius }]}
          wrapperStyle={styles.wheelWrapper}
          onComplete={this.onDialComplete.bind(this)}
          onValueChange={this.onvaluechange.bind(this)}
        />



      </View>
    );
  }
}

const styles = StyleSheet.create({
  responderStyle: {
    top: (Dimensions.get('window').height - 250 - 130)/4,
    backgroundColor: 'white',
    elevation: 1,
    shadowColor: 'rgba(0,0,0,.7)',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
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
