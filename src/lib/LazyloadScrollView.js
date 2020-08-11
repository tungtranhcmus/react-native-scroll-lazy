/* eslint-disable import/default */
/* eslint-disable linebreak-style */
/* eslint-disable import/named */
/* eslint-disable react/prop-types */


import React, {
    Component,
} from 'react'
import ReactNative, {
    Dimensions,
    Animated,
} from 'react-native'
import ReactNativePrototypeToScrollview from 'react-native-prototype-to-scrollview'
import LazyloadManager from './LazyloadManager'

class LazyloadScrollView extends Component {
    static displayName = 'LazyloadScrollView';

    static defaultProps = {
        renderDistance: 0,
        recycle: true,
        recycleDistance: Dimensions.get('window').height * 4,
        horizontal: false,
    };

    constructor() {
        super()
        this._manager = null
    }

    componentWillUnmount = () => {
        if (this._manager) {
            this._manager.destroy()
            this._manager = null
        }
    };

    _onLayout = (e, node) => {
        this.props.onLayout && this.props.onLayout(e, node)
        let { width, height } = e.nativeEvent.layout
        let {
            name,
            renderDistance,
            recycle,
            recycleDistance,
        } = this.props

        this._manager = new LazyloadManager(
            {
                name,
                dimensions: {
                    width,
                    height,
                },
                offset: renderDistance,
                recycle: recycle ? recycleDistance : 0,
                horizontal: this.props.horizontal,
            },
            ReactNative.findNodeHandle(this),
        )

    };

    _onScroll = e => {
        try {
            this.props.onScroll && this.props.onScroll(e)
            let { x, y } = e.nativeEvent.contentOffset
            this._manager && this._manager.calculate({ x, y })
        } catch (err) {
            //
        }

    };

    removeAll = () => {
        this._manager && this._manager.removeAll()
    }

    getScrollResponder = () => this._scrollResponder;

    render() {
        return this.props.name ? <Animated.ScrollView
            {...this.props}
            ref={ele => this._scrollResponder = ele}
            name={null}
            onScroll={this._onScroll}
            onLayout={this._onLayout}
            scrollEventThrottle={this.props.scrollEventThrottle || 16}
        /> : <Animated.ScrollView
                ref={ele => this._scrollResponder = ele}
                {...this.props}
            />
    }
}

Object.assign(LazyloadScrollView.prototype, ReactNativePrototypeToScrollview)

export default LazyloadScrollView
