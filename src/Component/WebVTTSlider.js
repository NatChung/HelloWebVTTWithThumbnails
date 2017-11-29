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

let sliderWidth = 300

const PREVIEW_WIDTH = 150
const PREVIEW_HEIGHT = 84
const DEFAULT_THUMB_SIZE = 40
const PREVIEW_HALF_WIDTH = PREVIEW_WIDTH / 2
const PREVIEW_LEFT_BOUND = 0


export default class WebVTTSlider extends Component {

    state = {
        imageuri: null,
        previewShiftX: 0,
        previewHidden: true,
        vtt: null
    }

    componentDidMount() {
        fetch(this.props.host + this.props.vttPath)
            .then(response => response.text())
            .then(body => {
                console.log(`download OK`)
                this.setState({
                    vtt: webvtt.parse(body)
                })
            })
    }

    _checkBound(left){
        if(this.refs.slider.props.style.length > 1 && this.refs.slider.props.style[1].width){
            sliderWidth = this.refs.slider.props.style[1].width
        }

        let PREVIEW_RIGHT_BOUND = sliderWidth - PREVIEW_WIDTH
        return (left < PREVIEW_LEFT_BOUND) ? 0 : (left > PREVIEW_RIGHT_BOUND) ? PREVIEW_RIGHT_BOUND : left
    }

    onSliderValueChange(value) {
        let index = Math.abs(Math.round(value * (this.state.vtt.cues.length -1)))
        this.setState({
            previewShiftX: this._checkBound(value * sliderWidth - PREVIEW_HALF_WIDTH),
            imageuri: this.props.host + this.state.vtt.cues[index].text,
            previewHidden: false
        })
    }

    onSlidingComplete() {
        this.setState({
            previewHidden: true
        })
    }

    renderImage(){
        return (this.state.previewHidden) ? null : (
            <Image source={{uri:this.state.imageuri}} style={[styles.preview, { left: this.state.previewShiftX }]} pointerEvents="none" />
        )
    }

    render = () => (
        <View  >
        {this.renderImage()}
        <Slider ref='slider'
            style={[styles.slider, this.props.style]}
            value={this.props.value}
            onValueChange={this.onSliderValueChange.bind(this)}
            onSlidingComplete={this.onSlidingComplete.bind(this)} />
        </View>
    )
}

const styles = StyleSheet.create({

    slider: {
        width: 300
    },

    preview: {
        position:'absolute',
        top: -PREVIEW_HEIGHT-20,
        width: PREVIEW_WIDTH,
        height: PREVIEW_HEIGHT,
        backgroundColor: 'black'
    }
})
