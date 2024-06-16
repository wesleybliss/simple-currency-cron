
const len = (key, val) => {
    if (val?.length > 0) return val
    throw new Error(`env: empty string (${key}: '${val}'))`)
}

const und = (key, val, dval) => {
    if (val === undefined)
        if (dval !== undefined) return dval
        else throw new Error(`env: undefined (${key})`)
    return val
}

export const str = (key, defaultValue = undefined) =>
    len(key, und(key, process.env[key], defaultValue)).toString()

export const int = (key, defaultValue = undefined) =>
    parseInt(und(key, process.env[key], defaultValue), 10)

export const bol = (key, defaultValue = undefined) => {
    
    const val = und(key, process.env[key], defaultValue)
    
    if (val === true || val === false) return val
    if (val === 'true') return true
    if (val === 'false') return false
    
    throw new Error(`env: not bool (${key})`)
    
}

export default {
    
    openExchangeRates: {
        appId: str('OPEN_EXCHANGE_RATES_APP_ID'),
    },
    
}
