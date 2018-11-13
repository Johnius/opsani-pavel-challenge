import './App.css'
import React, {Component} from 'react'
import classnames from 'classnames'
import {getServerStatus} from './server'
import API from './api'
import LastTimeServerFix from './components/LastTimeServerFix'
import Newsline from './components/Newsline'
import Source from './components/Source'
import Status from './components/Status'

class App extends Component {
    state = {
        news_data: [],
        news_loading: false,
        news_error: false,
        news_error_message: null,
        sources_data: [],
        sources_loading: false,
        sources_error: false,
        sources_error_message: null,
    }

    api = window.API = new API()

    componentDidMount() {
        this.fetchAll()
    }

    _fetch = (fn, entityName) => {
        this.setState({
            [`${entityName}_loading`]: true,
            [`${entityName}_error`]: false,
            [`${entityName}_error_message`]: null,
        })

        return fn()
            .then((data) => {
                this.setState({
                    [`${entityName}_data`]: data,
                    [`${entityName}_loading`]: false,
                    [`${entityName}_error`]: false,
                    [`${entityName}_error_message`]: null,
                })
                return data
            })
            .catch((err) => {
                this.setState({
                    [`${entityName}_loading`]: false,
                    [`${entityName}_error`]: true,
                    [`${entityName}_error_message`]: err.error.message,
                })
            })
    }

    fetchNews = () => {
        this._fetch(this.api.getNews, 'news')
    }

    fetchSources = () => {
        this._fetch(this.api.getSources, 'sources')
    }

    fetchAll = () => {
        this.fetchNews()
        this.fetchSources()
    }

    renderNews() {
        return this.state.news_data.map((newsline) => {
            return (
                <Newsline
                    key={newsline.title + newsline.time + newsline.source}
                    title={newsline.title}
                    surce={newsline.source}
                    date={newsline.time}
                    description={newsline.desc}
                />
            )
        })
    }

    renderSources() {
        return this.state.sources_data.map((source) => {
            return (
                <Source
                    key={source.title + source.icon}
                    title={source.title}
                    icon={source.icon}
                />
            )
        })
    }

    render() {
        const gotNews = this.state.news_data.length > 0
        const gotSources = this.state.sources_data.length > 0
        const loadingNews = this.state.news_loading
        const loadingSources = this.state.sources_loading
        const newsFailed = this.state.news_error
        const sourcesFailed = this.state.sources_error
        return (
            <div className="app">
                <section className="manage">
                    <button
                        onClick={this.fetchAll}
                        disabled={loadingSources || loadingNews}
                    >
                        Fetch all
                    </button>
                    <small>{' or '}</small>
                    <button
                        onClick={this.fetchSources}
                        disabled={loadingSources}
                    >
                        {
                            gotSources
                                ? 'Re-fetch sources'
                                : 'Fetch sources'
                        }
                    </button>
                    {' '}
                    <button onClick={this.fetchNews} disabled={loadingNews}>
                        {
                            gotNews
                                ? 'Re-fetch news'
                                : 'Fetch news'
                        }
                    </button>
                    <span style={{ marginLeft: 15 }}>
                        <LastTimeServerFix getServerStatus={getServerStatus}/>
                    </span>
                </section>
                <div className="body">
                    <div className={classnames('news pane', {_loading: loadingNews})}>
                        <h1>News</h1>
                        <section className="cards">
                            {
                                loadingNews &&
                                <Status title="Loading news…" time={1200}/>
                            }
                            {
                                newsFailed &&
                                <Status error>
                                    Could not load news. <button onClick={this.fetchNews}>Retry</button>
                                </Status>
                            }
                            {this.renderNews()}
                        </section>
                    </div>
                    <div className={classnames('sources pane', {_loading: loadingSources})}>
                        <h1>Sources</h1>
                        <section className="sources-wrapper">
                            {
                                loadingSources &&
                                <Status title="Loading sources…" time={600}/>
                            }
                            {
                                sourcesFailed &&
                                <Status error>
                                    Could not load sources. <button onClick={this.fetchSources}>Retry</button>
                                </Status>
                            }
                            {this.renderSources()}
                        </section>
                    </div>
                </div>
            </div>
        )
    }
}

export default App
