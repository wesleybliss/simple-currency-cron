import pkg from '../package.json' with { type: 'json' }
import * as cache from '../lib/cache.js'

export default async (req, res) => {
    
    /* res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', '*')
    res.setHeader('Access-Control-Allow-Headers', '*') */
    
    if (req.method === 'OPTIONS')
        return res.status(200).end()
    
    const currencies = await cache.readCurrencies()
    const pairs = await cache.readPairs()
    const converts = await cache.readConverts()
    
    console.log('/status', {
        currencies,
        pairs,
        converts,
    })
    
    res.status(200).json({
        name: pkg.name,
        version: pkg.version,
        currencies: currencies?.data?.currencies?.length || 0,
        pairs: Object.keys(pairs || {}).length,
        converts: converts?.length,
    })
    
}
