export function randomFromTo(from, to) {
    return Math.floor(from + Math.random() * Math.max(to - from, 0))
}

export function getSampleSet(sourceSet, count = 10) {
    const setlen = sourceSet.length
    const ret = {}
    let limit = Math.min(count, setlen)
    while (limit > 0) {
        const idx = Math.floor(Math.random() * (setlen - .1))
        if (!ret.hasOwnProperty(idx)) {
            ret[idx] = sourceSet[idx]
            limit--
        }
    }
    return Object.values(ret)
}

export function resolveOrRejectWithChance(rejectionData, chance) {
    return (response) => {
        if (Math.random() <= chance) {
            return Promise.reject(rejectionData)
        }
        return Promise.resolve(response)
    }
}

export function delayPromiseResolution(delay) {
    return (response) => new Promise((resolve) => setTimeout(() => resolve(response), delay))
}

export function delayPromiseRejection(delay) {
    return (error) => new Promise((_, reject) => setTimeout(() => reject(error), delay))
}

export function secsSince(date) {
    const now = new Date()
    return Number((now - date) / 1000).toFixed(3)
}