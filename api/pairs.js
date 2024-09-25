import * as cache from '../lib/cache'
import openExchangeRatesApi from '../lib/openExchangeRatesApi'

module.exports = async (req, res) => {
    
    try {
        
        if (!req.body.base) throw new Error('base is required')
        if (!req.body.targets) throw new Error('targets is required')
        if (!req.body.value) throw new Error('value is required')
        
        const baseName = req.body.base.toUpperCase()
        const targetNames = req.body.targets.map(it => it.toUpperCase())
        const value = req.body.value
        const refresh = req.body.refresh || false
        
        // @todo confirm both currencies exist
        /* if (!exchangeRates.hasOwnProperty(baseCurrency) || !exchangeRates.hasOwnProperty(targetCurrency))
            throw new Error(`Unsupported currencies. '${baseCurrency}' or '${targetCurrency}' not found in exchange rates.`);
         */
        const pair = baseName + '-' + targetNames.sort().join('-')
        
        if (refresh)
            await cache.deletePairs(pair)
        
        const cached = await cache.readPairs(pair)
        
        let source = 'remote'
        
        if (cached) {
            source = 'cache'
            console.info('pairs: read from cache')
            return res.status(200).json({
                source,
                ...cached,
            })
        }
        
        const timestamp = Date.now()
        const data = await openExchangeRatesApi
            .get(`latest.json?symbols=${baseName},${targetNames.join(',')}&prettyprint=false`)
        
        console.info('pairs: read from remote, caching')
        
        await cache.writePairs({
            timestamp,
            data: {
                rates: data.rates,
            },
        }, pair)
        
        res.status(200).json({
            timestamp,
            data: {
                rates: data.rates,
            },
            source,
        })
        
    } catch (e) {
        
        res.status(500).json({
            error: e.message,
        })
        
    }
    
}
