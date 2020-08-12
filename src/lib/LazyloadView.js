/* eslint-disable linebreak-style */
/* eslint-disable import/named */
/* eslint-disable react/prop-types */

import React, { Component } from 'react'
import { View } from 'react-native'
import LazyloadManager from './LazyloadManager'

let id = 0

class LazyloadView extends Component {
    static displayName = 'LazyloadView';
    constructor() {
        super(...arguments)
        if (this.props.host) {
            this._id = id++
            this.state = { height: 0, show: true }
        }
        this._hasHeight = false
        this._first = true
    }

    componentWillUnmount = () => {
        if (this.props.host) LazyloadManager.remove(this.props.host, this._id)
    };

    shouldComponentUpdate(nextProps, nextState) {
        const { height, show } = this.state
        const { reload } = this.props
        if ((nextState.height !== height && !!nextState.height) || nextState.show !== show || nextProps.reload !== reload)
            return true
        return false
    }

    measureLayout = (...args) => {
        this._root.measureLayout(...args)
    };

    _show = (show) => {
        const { eventShowView } = this.props
        const { show: showState } = this.state
        if (show !== showState || this._first) {
            this.setState({ show })
            eventShowView && eventShowView(show, this._id)
            this._first = false
        }

    }

    updateHeightArray = (height) => {
        const { place, updateHeightArray, host, heightTemp, eventChangeHeight } = this.props
        eventChangeHeight && eventChangeHeight(height)
        updateHeightArray && updateHeightArray({ height: (height - heightTemp), place, host })
    }

    _onLayout = (e) => {
        if (this._hasHeight) return
        this.props.onLayout && this.props.onLayout(e)
        let { height } = e.nativeEvent.layout
        if (height) this._hasHeight = true
        this.setState({ height })
        this.updateHeightArray(height)
        LazyloadManager.add(
            {
                name: this.props.host,
                id: this._id,
            },
            this.measureLayout,
            this._show,
        )
    };

    render() {
        const { height, show } = this.state
        return this.props.host ? <View
            height={height != 0 ? height : undefined}
            {...this.props}
            ref={ele => this._root = ele}
            onLayout={this._onLayout}
        >
            {show ? this.props.children : null}
        </View> : <View
                ref={ele => this._root = ele}
                {...this.props}
            />
    }
}

export default LazyloadView
