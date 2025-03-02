
export const isElapsedTimeGteHours = (startDate, endDate, maxHours) => {
    
    if (startDate.getTime() >= endDate.getTime())
        throw new Error(`Start date must be less than end date (${startDate.getTime()}, ${endDate.getTime()})`);
    
    // Calculate the difference in milliseconds
    const timeDifference = Math.abs(endDate.getTime() - startDate.getTime())
    
    // Convert milliseconds to hours (divide by 1000 milliseconds/second, then 3600 seconds/hour)
    const elapsedHours = timeDifference / (1000 * 3600)
    
    // Check if elapsed hours are greater than or equal to 6
    return elapsedHours >= maxHours
    
}

export const ensureValidCurrencyRate = rate => {
    
    let value = rate || 0.0
    
    if (typeof value !== 'number')
        value = parseFloat(value)
    
    if (isNaN(value))
        value = 0.0
    
    if (typeof value === 'string')
        value = parseFloat(value)
    
    if (value === 0)
        value = 0.0
    
    return value
    
}

export const ensureValidCurrency = currency => {
    
    currency.rate = ensureValidCurrencyRate(currency.rate)
    
    return currency
    
}
