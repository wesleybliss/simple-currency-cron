'use client'

import { useState } from 'react'
import useDebug from '../hooks/useDebug'

export default function Home() {
    
    const [fromCurrency, setFromCurrency] = useState('USD')
    const [toCurrency, setToCurrency] = useState('EUR')
    const [amount, setAmount] = useState('100')
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSwap = () => {
        setFromCurrency(toCurrency)
        setToCurrency(fromCurrency)
        setResult(null)
    }

    const handleConvert = async () => {
        
        if (!fromCurrency || !toCurrency || !amount)
            return

        setLoading(true)
        setError(null)
        setResult(null)

        try {
            
            const response = await fetch(
                `/api/convert?from=${toCurrency}&to=${fromCurrency}&value=${amount}`
            )

            if (!response.ok)
                throw new Error('Failed to convert currency')

            const data = await response.json()
            console.log('handleConvert', data)
            setResult(data)
            
        } catch (e) {
            console.error(e)
            setError(e.message)
        } finally {
            setLoading(false)
        }
        
    }
    
    useDebug()
    
    return (
        
        <main className="flex min-h-screen flex-col items-center justify-center p-8">
            
            <div className="w-full max-w-md space-y-6">
                
                <h1 className="text-3xl font-bold text-center mb-8">Currency Converter</h1>
                
                <div className="space-y-4">
                    
                    <div>
                        <label className="block text-sm font-medium mb-2">From</label>
                        <input
                            type="text"
                            value={fromCurrency}
                            onChange={(e) => setFromCurrency(e.target.value.toUpperCase())}
                            placeholder="USD"
                            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={handleSwap}
                            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                            aria-label="Swap currencies"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                            </svg>
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">To</label>
                        <input
                            type="text"
                            value={toCurrency}
                            onChange={(e) => setToCurrency(e.target.value.toUpperCase())}
                            placeholder="EUR"
                            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Amount</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="100"
                            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        onClick={handleConvert}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white px-6 py-3 text-lg rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Converting...' : 'Convert'}
                    </button>
                    
                </div>

                {error && (
                    <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="p-6 bg-white border border-gray-200 rounded-lg space-y-3 rounded-xl">
                    {result && (<>
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">Exchange Rate</p>
                            <p className="text-xl font-semibold">
                                1 {fromCurrency} = {result[toCurrency]} {toCurrency}
                            </p>
                        </div>
                        <div className="border-t pt-3 text-center">
                            <p className="text-sm text-gray-600 mb-1">Converted Amount</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {result.result.toFixed(2)} {toCurrency}
                            </p>
                        </div>
                        <p className="text-xs text-gray-500 text-center">
                            Source: {result.source}
                        </p>
                    </>)}
                </div>
                
            </div>
            
        </main>
        
    )
    
}
