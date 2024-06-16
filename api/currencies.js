import * as cache from '../lib/cache'
import openExchangeRatesApi from '../lib/openExchangeRatesApi'

module.exports = async (req, res) => {
    
    try {
        
        const cached = await cache.readCurrencies()
        
        if (cached) {
            console.info('currencies: read from cache')
            return res.status(200).json(cached)
        }
        
        const data = await openExchangeRatesApi.get('currencies.json')
        
        console.info('currencies: read from remote, caching')
        await cache.writeCurrencies({ timestamp: Date.now(), data })
        
        res.status(200).json(data)
        
    } catch (e) {
        
        res.status(500).json({
            error: e.message,
        })
        
    }
    
}
