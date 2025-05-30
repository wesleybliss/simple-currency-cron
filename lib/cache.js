import * as kv from './kv.js'
import { isElapsedTimeGteHours } from './utils.js'

export const needsUpdate = (timestamp, maxHours) => isElapsedTimeGteHours(
    new Date(timestamp),
    new Date(),
    maxHours,
)

export const readFactory = (key, maxHours = 6) => async (subKey = null) => {
    
    const fullKey = subKey ? `${key}:${subKey}` : key
    const cached = await kv.readByKey(fullKey)
    
    if (!cached)
        return null
    
    const { timestamp, data } = cached
    
    if (!timestamp || !data)
        return null
    
    if (needsUpdate(timestamp, maxHours))
        return null
    
    return cached
    
}

export const writeFactory = key => (data, subKey = null) => {
    
    const fullKey = subKey ? `${key}:${subKey}` : key
    
    return kv.writeByKey(fullKey, data)
    
}

export const deleteFactory = key => (subKey = null) => {
    
    const fullKey = subKey ? `${key}:${subKey}` : key
    
    return kv.deleteByKey(fullKey)
    
}

export const readCurrencies = readFactory('currencies', 6)
export const writeCurrencies = writeFactory('currencies')
export const deleteCurrencies = deleteFactory('currencies')

export const readPairs = readFactory('pairs', 6)
export const writePairs = writeFactory('pairs')
export const deletePairs = deleteFactory('pairs')

export const readConverts = readFactory('converts', 6)
export const writeConverts = writeFactory('converts')
export const deleteConverts = deleteFactory('converts')
