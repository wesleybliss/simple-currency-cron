import Api from './api.js'
import env from './env.js'

export const baseUrl = 'https://openexchangerates.org/api'

export default new Api(baseUrl, {
    headers: {
        ...Api.defaultHeaders,
        'Authorization': `Token ${env.openExchangeRates.appId}`,
    },
})
