/* eslint-disable linebreak-style */
/* eslint-disable no-cond-assign */
/* eslint-disable no-prototype-builtins */
/* eslint-disable import/named */
/* eslint-disable react/prop-types */

import ReactNativeMeasureLayoutScrollview from 'react-native-measure-layout-scrollview'

const containers = {}

class LazyloadManager {
    static add = ({ name, id }, measureLayout, show) => {
        let container = containers[name]
        if (!container) {
            container = containers[name] = {
                children: {},
                count: 0,
                contentOffset: { x: 0, y: 0 },
                uninitiated: [],
            }
        }

        if (container.dimensions) {
            if (!container.children[id]) {
                container.count++
            }

            container.children[id] = new ReactNativeMeasureLayoutScrollview(
                container,
                measureLayout,
                show,
            )
        } else {
            container.uninitiated.unshift(() => {
                LazyloadManager.add({ name, id }, measureLayout, show)
            })
        }
    };

    static remove = (name, id) => {
        let container = containers[name]
        if (container && container.children[id]) {
            delete container.children[id]
            container.count--
        }
    };

    constructor({ name, dimensions, offset = 0, recycle, horizontal, contentOffset = { x: 0, y: 0 } }, data) {
        this._name = name

        let content = {
            offset,
            recycle,
            horizontal,
            contentOffset,
            dimensions,
            data,
        }
        if (!containers[name]) {
            containers[name] = {
                children: {},
                count: 0,
                uninitiated: [],
                ...content,
            }
        } else {
            Object.assign(containers[name], content)
        }

        let uninitiated
        while (uninitiated = containers[name].uninitiated.pop()) {
            uninitiated()
        }
    }

    _name = null;

    calculate = ({ x, y }) => {
        let container = containers[this._name]

        container.contentOffset = { x, y }
        if (container.count) {
            let children = container.children
            for (let key in children) {
                if (children.hasOwnProperty(key)) {
                    children[key].move(x, y)
                }
            }
        }
    };

    removeAll = () => {
        let container = containers[this._name]
        if (container) {
            container.children = {}
            container.count = 0
        }
    };


    destroy = () => {
        this._container = containers[this._name] = null
    };
}

export default LazyloadManager
