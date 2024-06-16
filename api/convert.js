import * as cache from '../lib/cache'
import openExchangeRatesApi from '../lib/openExchangeRatesApi'

module.exports = async (req, res) => {
    
    try {
        
        const baseName = req.query.from.toUpperCase()
        const targetName = req.query.to.toUpperCase()
        const value = req.query.value
        const refresh = req.query.refresh
        
        // @todo confirm both currencies exist
        /* if (!exchangeRates.hasOwnProperty(baseCurrency) || !exchangeRates.hasOwnProperty(targetCurrency))
            throw new Error(`Unsupported currencies. '${baseCurrency}' or '${targetCurrency}' not found in exchange rates.`);
         */
        const pair = [baseName, targetName].sort().join('-')
        
        if (refresh)
            await cache.deletePairs(pair)
        
        const cached = await cache.readPairs(pair)
        
        let base
        let target
        
        if (cached) {
            
            console.info('convert: read from cache')
            
            base = cached.rates[baseName]
            target = cached.rates[targetName]
            
        } else {
            
            let data = await openExchangeRatesApi
                .get(`latest.json?symbols=${baseName},${targetName}&prettyprint=false`)
            
            console.info('convert: read from remote, caching')
            
            await cache.writePairs({
                timestamp: Date.now(),
                data: {
                    rates: data.rates,
                },
            }, pair)
            
            base = data.rates[baseName]
            target = data.rates[targetName]
            
        }
        
        const exchangeRate = base / target
        
        const data = {
            [baseName]: base,
            [targetName]: target,
            result: value * exchangeRate,
        }
        
        res.status(200).json(data)
        
    } catch (e) {
        
        res.status(500).json({
            error: e.message,
        })
        
    }
    
}
