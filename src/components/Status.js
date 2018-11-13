import React from 'react'
import PropTypes from 'prop-types'

export default class Status extends React.Component {
    static propTypes = {
        time: PropTypes.number,
        title: PropTypes.string,
        children: PropTypes.any,
        error: PropTypes.bool,
    }

    static defaultProps = {
        error: false,
        children: null,
        title: null,
    }

    state = {
        width: '0%',
        time: 0,
    }

    componentDidMount() {
        this.timeout = setTimeout(() => {
            this.setState({width: '95%'})
        }, 0)
    }

    componentWillUnmount() {
        clearTimeout(this.timeout)
    }

    timeout

    get time() {
        const {time} = this.props
        return `${Number(time / 1000).toFixed(1)}s`
    }

    render() {
        const { error } = this.props
        return (
            <div className="status-wrapper">
                <div className="status">
                    <div
                        className="status__progress"
                        style={{
                            width: error ? '100%' : this.state.width,
                            transitionDuration: this.time,
                            backgroundColor: error ? 'red' : 'black',
                        }}
                    />
                    {this.props.title || this.props.children}
                </div>
            </div>
        )
    }
}