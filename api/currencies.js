import * as cache from '../lib/cache'
import openExchangeRatesApi from '../lib/openExchangeRatesApi'
import { ensureValidCurrencyRate } from '../lib/utils'

const cacheEnabled = true

module.exports = async (req, res) => {
    
    try {
        
        console.log('currencies: warming cache')
        
        let source = 'remote'
        const cached = await cache.readCurrencies()
        
        if (cacheEnabled && cached) {
            
            source = 'cache'
            console.info(`currencies: read from cache (${cached.data.currencies.length})`, /* , cached */)
            
            return res.status(200).json({
                source,
                ...cached,
            })
            
        }
        
        console.log('currencies: fetching remote currencies')
        
        const timestamp = Date.now()
        const currencies = await openExchangeRatesApi.get('currencies.json')
        const symbols = await openExchangeRatesApi
            .get(`latest.json?symbols=USD,${Object.keys(currencies).join(',')}&prettyprint=false`)
        
        const data = {
            currencies: Object.keys(currencies).map(it => ({
                symbol: it,
                name: currencies[it],
                rate: ensureValidCurrencyRate(symbols.rates[it]),
            }))
        }
        
        /* data.currencies.forEach(it => {
            if (!it.rate)
                throw new Error('invalid rate for ' + JSON.stringify(it, null, 4))
        }) */
        
        console.info('currencies: read from remote, caching')
        await cache.writeCurrencies({
            timestamp,
            data,
        })
        
        res.status(200).json({
            source,
            timestamp,
            data,
        })
        
    } catch (e) {
        
        console.error('currencies: error', e)
        
        res.status(500).json({
            error: e.message,
        })
        
    }
    
}
