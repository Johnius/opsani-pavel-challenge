import {
    delayPromiseRejection,
    delayPromiseResolution,
    getSampleSet,
    randomFromTo,
    resolveOrRejectWithChance
} from './utils'
import DEMO_DATA from './demodata'

const SERVER_STAY_FIXED_MS = 30 * 1e3
export const ENDPOINT_FAIL_CHANCE = .75
const SERVER_FIX_FAIL_CHANCE = .66
const SERVER_FAIL_RESPONSE = 'There is a server-side problem taking place.'

let lastTimeFixed = 0

export const getWillStayFixedFor = () => {
    const sinceLastFix = new Date() - lastTimeFixed
    const leftUntilFixNeeded = (SERVER_STAY_FIXED_MS - sinceLastFix) / 1000
    return Math.max(Number(leftUntilFixNeeded).toFixed(1), 0)
}

export const getFailChancePercentage = () => ENDPOINT_FAIL_CHANCE * 100

export const getServerStatus = () => ({secsLeft: getWillStayFixedFor(), failPercentage: getFailChancePercentage()})

export function isServerFixed() {
    return new Date() - lastTimeFixed < SERVER_STAY_FIXED_MS
}

export function fixServer() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() <= SERVER_FIX_FAIL_CHANCE) {
                reject({message: 'Failed to fix the server.'})
            } else {
                lastTimeFixed = new Date()
                resolve()
            }
        }, randomFromTo(250, 500))
    })
}

export function getFailureChance() {
    if (isServerFixed()) return 0
    return ENDPOINT_FAIL_CHANCE
}

export function getNews() {
    const delay = randomFromTo(750, 1200)
    return Promise.resolve(getSampleSet(DEMO_DATA.news, 20))
        .then(resolveOrRejectWithChance({msg: SERVER_FAIL_RESPONSE}, getFailureChance()))
        .then(delayPromiseResolution(delay))
        .catch(delayPromiseRejection(delay))
}

export function getSources() {
    const delay = randomFromTo(150, 600)
    return Promise.resolve(getSampleSet(DEMO_DATA.sources, 10))
        .then(resolveOrRejectWithChance({msg: SERVER_FAIL_RESPONSE}, getFailureChance()))
        .then(delayPromiseResolution(delay))
        .catch(delayPromiseRejection(delay))
}