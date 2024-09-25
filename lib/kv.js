import { kv } from '@vercel/kv'

export const readFactory = key => async () => {
    
    try {
        return await kv.get(key)
    } catch (e) {
        console.error(e)
        throw new Error(`Failed to read ${key} from cache`)
    }
    
}

export const writeFactory = key => async data => {
    
    try {
        return await kv.set(key, data)
    } catch (e) {
        console.error(e)
        throw new Error(`Failed to write ${key} to cache`)
    }
    
}

export const deleteFactory = key => async () => {
    
    try {
        return await kv.del(key)
    } catch (e) {
        console.error(e)
        throw new Error(`Failed to delete ${key} to cache`)
    }
    
}

export const readByKey = key => readFactory(key)()
export const writeByKey = (key, data) => writeFactory(key)(data)
export const deleteByKey = key => deleteFactory(key)()

/* export const readCurrencies = readFactory('currencies')
export const writeCurrencies = writeFactory('currencies')
export const deleteCurrencies = deleteFactory('currencies') */
