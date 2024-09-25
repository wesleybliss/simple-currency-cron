import Api from './api'
import env from './env'

export const baseUrl = 'https://openexchangerates.org/api'

export default new Api(baseUrl, {
    headers: {
        ...Api.defaultHeaders,
        'Authorization': `Token ${env.openExchangeRates.appId}`,
    },
})
