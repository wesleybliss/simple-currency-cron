import { useState, useEffect } from 'react'
import Api from '../lib/api.js'

const useDebug = () => {
    
    const [api, setApi] = useState()
    
    useEffect(() => {
        
        const baseUrl = `${location.protocol}//${window.location.host}/api`
        setApi(new Api(baseUrl))
        
    }, [])
    
    useEffect(() => {
        
        if (!api || window.simpleCurrency) return
        
        window.simpleCurrency = {
            fetchStatus: async () => {
                const res = await api.get('status')
                console.log(res)
                return res
            },
            clearAll: async () => {
                const res = await Promise.all([
                    api.get('clear?key=pairs'),
                    api.get('clear?key=currencies'),
                ])
                console.log(res)
                return res
            }
        }
        
        console.log('Debug initialized')
        
    }, [api])
    
}

export default useDebug
