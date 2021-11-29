import React, { Component } from 'react'
import loading from '../loading.gif';

export class Loader extends Component {
    render() {
        return (
            <div className="text-center">
                <img className="my-5" src={loading} alt="Page is Loading! Please Wait!" />
            </div>
        )
    }
}

export default Loader
