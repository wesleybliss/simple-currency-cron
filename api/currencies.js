import * as cache from '../lib/cache'
import openExchangeRatesApi from '../lib/openExchangeRatesApi'

module.exports = async (req, res) => {
    
    try {
        
        let source = 'remote'
        const cached = await cache.readCurrencies()
        
        if (cached) {
            source = 'cache'
            console.info('currencies: read from cache')
            return res.status(200).json({
                source,
                ...cached,
            })
        }
        
        const timestamp = Date.now()
        const currencies = await openExchangeRatesApi.get('currencies.json')
        
        console.info('currencies: read from remote, caching')
        await cache.writeCurrencies({
            timestamp,
            data: {
                currencies,
            },
        })
        
        res.status(200).json({
            source,
            timestamp,
            data: {
                currencies,
            },
        })
        
    } catch (e) {
        
        res.status(500).json({
            error: e.message,
        })
        
    }
    
}
