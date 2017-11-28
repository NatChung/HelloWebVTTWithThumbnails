import React, { Component } from 'react';
import webvtt from 'node-webvtt'
import {
    Platform,
    StyleSheet,
    View,
    Slider,
    Image,
    Dimensions
} from 'react-native';

const PREVIEW_WIDTH = 150
const PREVIEW_HEIGHT = 84
const DEFAULT_THUMB_SIZE = 40
const TEST_SLIDER_WIDTH = 300
const PREVIEW_HALF_WIDTH = PREVIEW_WIDTH / 2
const PREVIEW_LEFT_BOUND = 0
const PREVIEW_RIGHT_BOUND = TEST_SLIDER_WIDTH - PREVIEW_WIDTH

export default class WebVTTSlider extends Component {

    state = {
        imageuri: null,
        previewShiftX: 0,
        previewHidden: true,
        vtt: null
    }

    componentDidMount() {
        fetch('http://127.0.0.1/earth.vtt')
            .then(response => response.text())
            .then(body => {
                console.log(`download done`)
                this.setState({
                    vtt: webvtt.parse(body)
                })
            })
    }

    onSliderValueChange(value) {

        let index = Math.round(value * (this.state.vtt.cues.length -1))
        console.log(`index:${index}`)

        let center = value * TEST_SLIDER_WIDTH
        let left = center - PREVIEW_HALF_WIDTH
       
        if(left < PREVIEW_LEFT_BOUND)
            left = 0
        else if(left > PREVIEW_RIGHT_BOUND)
            left = PREVIEW_RIGHT_BOUND

        this.setState({
            value: value,
            previewShiftX: left,
            imageuri: 'http://127.0.0.1' + this.state.vtt.cues[index].text,
            previewHidden: false
        })

        
    }

    onSlidingComplete() {
        console.log(`onSlidingComplete`)
        this.setState({
            previewHidden: true
        })
    }

    renderImage(){
        if(this.state.previewHidden)
            return null
        
        return (
            <Image source={{uri:this.state.imageuri}} style={[styles.preview, { left: this.state.previewShiftX }]} pointerEvents="none" />
        )
    }

    render = () => (
        <Slider style={styles.slider}
            value={this.state.value}
            onValueChange={this.onSliderValueChange.bind(this)}
            onSlidingComplete={this.onSlidingComplete.bind(this)} >
            {this.renderImage()}
        </Slider>
    )
}

const styles = StyleSheet.create({

    slider: {
        width: 300
    },

    preview: {
        top: -PREVIEW_HEIGHT,
        width: PREVIEW_WIDTH,
        height: PREVIEW_HEIGHT,
        backgroundColor: 'red'
    }
})
