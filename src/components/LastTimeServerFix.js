import React from 'react'
import PropTypes from 'prop-types'

export default class LastTimeServerFix extends React.Component {
    static propTypes = {
        getServerStatus: PropTypes.func.isRequired
    }

    componentDidMount() {
        this.updateTimeout = setInterval(this.forceUpdate.bind(this), 100)
    }

    componentWillUnmount() {
        clearInterval(this.updateTimeout)
    }

    render() {
        const { getServerStatus } = this.props
        const status = getServerStatus()
        const secs = status.secsLeft

        if (secs === 0) {
            return <small>There is {status.failPercentage}% chance request will fail.</small>
        }

        return (
            <small>
                Requests will succeed within next {secs} seconds.
            </small>
        )
    }
}