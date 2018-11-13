import {Subject, from, defer, of} from 'rxjs'
import {exhaustMap, flatMap, retryWhen, tap, take, retry, catchError} from 'rxjs/operators'
import {getNews, getSources, fixServer} from './server'
import {secsSince} from './utils'

class Err {
    error

    constructor(err) {
        this.error = err
    }
}

export default class API {
    static fetchNews(onFetch) {
        return () => {
            onFetch()
            return getNews()
        }
    }

    static fetchSources(onFetch) {
        return () => {
            onFetch()
            return getSources()
        }
    }

    static requestRetry({fetchFn, fixFn, onFetchFail, onFixSucceed, onFetchSucceed, onFetchFinalFail}) {
        return defer(() => from(fetchFn()))
            .pipe(
                retryWhen((errors) =>
                    errors.pipe(
                        tap(onFetchFail),
                        flatMap(() => defer(() => fixFn()).pipe(
                            flatMap((v) => {
                                if (v instanceof Err) throw v
                                return of(v)
                            }),
                            tap(onFixSucceed),
                        )),
                    )
                ),
                tap(onFetchSucceed, onFetchFinalFail)
            )
            .toPromise()
    }

    constructor() {
        this.schedulerSubject.subscribe((v) => this.resultSubject.next(v))
    }

    schedulerSubject = new Subject().pipe(
        exhaustMap((fixServerProblem) =>
            defer(() => from(fixServerProblem())).pipe(
                retry(3),
                catchError((err) => of(new Err(err))),
            )
        ),
    )

    resultSubject = new Subject()

    _scheduleFixFn = (onFix, onFixFail) => {
        return () => {
            this.schedulerSubject.next(this.fixServerProblem.bind(this, onFix, onFixFail))
            return this.resultSubject.pipe(take(1))
        }
    }

    fixServerProblem(onFix, onFixFail) {
        onFix()
        return fixServer()
            .catch((err) => {
                onFixFail()
                throw err
            })
    }

    _requestEndpoint(endpointFn, entityName) {
        let fixAttempt = 0
        const since = () => secsSince(new Date())
        const onFetch = () => console.info(`🌀 [${since()}] ${entityName}: Fetching.`)
        const onFetchFail = () => console.log(`❗ [${since()}] ${entityName}: Failed. Waiting for server to get fixed.`)
        const onFetchSucceed = () => console.log(`✅ [${since()}] ${entityName}: Succeeded.`)
        const onFetchFinalFail = (err) => console.log(`🛑 [${since()}] ${entityName}: Server was not able to get fixed after multiple attempts.`, err)
        const onFix = () => console.log(`🌐 [${since()}] SERVER (${entityName}): Trying to fix server. (attempt ${++fixAttempt})`)
        const onFixFail = () => console.log(`❗ [${since()}] SERVER (${entityName}): Failed to fix server.`)
        const onFixSucceed = () => console.log(`🌱 [${since()}] SERVER (${entityName}): Got fixed.`)
        return API.requestRetry({
            fetchFn: endpointFn(onFetch),
            onFetchFail,
            onFetchSucceed,
            onFetchFinalFail,
            fixFn: this._scheduleFixFn(onFix, onFixFail),
            onFixSucceed,
        })
    }

    getNews = () => this._requestEndpoint(API.fetchNews, 'NEWS')

    getSources = () => this._requestEndpoint(API.fetchSources, 'SOURCES')
}
