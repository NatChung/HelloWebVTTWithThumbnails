import React, { Component } from 'react';
import webvtt from 'node-webvtt'
import Slider from 'react-native-slider'
import FastImage from 'react-native-fast-image'
import {
    Platform,
    StyleSheet,
    View,
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
        imageuri: '',
        previewShiftX: 0,
        value: 0
    }

    constructor(props){
        super(props)

        fetch(this.props.host + this.props.vttPath)
        .then(response => response.text())
        .then(body => this._convertToWebVTT(body))
    }

    get currentValue(){
        return this.state.value
    }

    componentWillReceiveProps(nextProps){
        if(this.props.value != nextProps.value){
            this.setState({value: nextProps.value})
        }
    }

    _preloadImages(vtts){

        let imageUris = []
        vtts.forEach((vtt, index, array) => {
            imageUris.push({
                uri: this.props.host + vtt.text,
                priority: FastImage.priority.normal
            })
            if(index == (array.length - 1)){
                FastImage.preload(imageUris)
            }
        })
    }


    _convertToWebVTT(body){
        this.webvtt = webvtt.parse(body)
        this.duration = this.webvtt.cues[this.webvtt.cues.length-1].end
        this._preloadImages(this.webvtt.cues)
    }

    _checkBound(left){
        if(this.refs.slider.props.style.length > 1 && this.refs.slider.props.style[1].width){
            sliderWidth = this.refs.slider.props.style[1].width
        }

        let PREVIEW_RIGHT_BOUND = sliderWidth - PREVIEW_WIDTH
        return (left < PREVIEW_LEFT_BOUND) ? 0 : (left > PREVIEW_RIGHT_BOUND) ? PREVIEW_RIGHT_BOUND : left
    }

    moveSliderValue(value){

        if(!this.duration || !this.webvtt) {
            this.setState({value: value})
            return
        }

        let current = value * this.duration
        this.webvtt.cues.forEach(vtt => {
            if(current >= vtt.start && current <= vtt.end){
                this.setState({
                    previewShiftX: this._checkBound(value * sliderWidth - PREVIEW_HALF_WIDTH),
                    imageuri: this.props.host + vtt.text,
                    value: value
                })
                return
            }
        })
    }

    _onSliderValueChange(value) {
        this.moveSliderValue(value)
    }

    onSlidingStart(){
        if(this.props.onSlidingStart) this.props.onSlidingStart()
    }

    onSlidingComplete() {
        if(this.props.onSlidingCompleteWithValue) this.props.onSlidingCompleteWithValue(this.state.value)
    }

    renderImage(){
        return (this.props.previewHidden || this.state.imageuri==='') ? null : (
            <FastImage source={{uri:this.state.imageuri}}
                priority={FastImage.priority.normal}
                style={[styles.preview, { left: this.state.previewShiftX }]} pointerEvents="none" />
        )
    }

    render = () => (
        <View  >
        {this.renderImage()}
        <Slider ref='slider'
            style={[styles.slider, this.props.style]}
            thumbTintColor = {'white'}
            minimumTrackTintColor= {'#396CD2'}
            thumbTouchSize={{width:80, height:80}}
            value={this.state.value}
            onValueChange={this._onSliderValueChange.bind(this)}
            onSlidingComplete={this.onSlidingComplete.bind(this)}
            onSlidingStart={this.onSlidingStart.bind(this)} />
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
