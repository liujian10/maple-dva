import React from 'react'
import { connect } from 'dva'

class Route extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const { location: { pathname, hash } } = this.props
        return (
            <div>
                <h2>{`Path: ${pathname} ${hash}`}</h2>
            </div>
        )
    }
}

export default connect(({ routing }) => ({ ...routing }))(Route)
