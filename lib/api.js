
export default class Api {
    
    static defaultHeaders = {
        'Content-Type': 'application/json',
    }
    
    constructor(baseUrl, {
        headers = Api.defaultHeaders,
    } = {}) {
        
        if (!baseUrl || typeof baseUrl!== 'string')
            throw new Error('The baseUrl must be a string')
        
        this.baseUrl = baseUrl
        this.headers = headers
        
    }
    
    makeUrl(endpoint) {
        
        if (endpoint.startsWith('/'))
            endpoint = endpoint.substring(1)
        
        return `${this.baseUrl}/${endpoint}`
        
    }
    
    makeHeaders(extraHeaders = {}) {
        
        return {
            ...this.headers,
            ...extraHeaders,
        }
        
    }
    
    async get(endpoint) {
        
        const url = this.makeUrl(endpoint)
        
        try {
            
            const response = await fetch(url, {
                headers: this.makeHeaders(),
            })
            
            if (!response.ok)
                throw new Error(`HTTP error status: ${response.status}`)
            
            return await response.json()
            
        } catch (error) {
            
            console.error('Fetch Error:', error)
            throw error
            
        }
        
    }
    
    async post(endpoint, body) {
        
        const url = this.makeUrl(endpoint)
        
        try {
            
            const response = await fetch(url, {
                method: 'POST',
                headers: this.makeHeaders(),
                body: JSON.stringify(body),
            })
            
            if (!response.ok)
                throw new Error(`HTTP error status: ${response.status}`)
            
            return await response.json()
            
        } catch (error) {
            
            console.error('Fetch Error:', error)
            throw error
            
        }
        
    }
    
    async put(endpoint, body) {
        
        const url = this.makeUrl(endpoint)
        
        try {
            
            const response = await fetch(url, {
                method: 'PUT',
                headers: this.makeHeaders(),
                body: JSON.stringify(body),
            })
            
            if (!response.ok)
                throw new Error(`HTTP error status: ${response.status}`)
            
            return await response.json()
            
        } catch (error) {
            
            console.error('Fetch Error:', error)
            throw error
            
        }
        
    }
    
    async delete(endpoint) {
        
        const url = this.makeUrl(endpoint)
        
        try {
            
            const response = await fetch(url, {
                method: 'DELETE',
                headers: this.makeHeaders(),
            })
            
            if (!response.ok)
                throw new Error(`HTTP error status: ${response.status}`)
            
        } catch (error) {
            
            console.error('Fetch Error:', error)
            throw error
            
        }
        
    }
    
}

/*
// Example usage:
const api = new Api('https://example.com/api')

// Making a GET request
api.get('users').then(users => console.log(users))

// Making a POST request
api.post('users', { name: 'John Doe' }).then(user => console.log(user))

// Making a PUT request
api.put('users/1', { name: 'Jane Doe' }).then(() => console.log('User updated'))

// Making a DELETE request
api.delete('users/1').then(() => console.log('User deleted'))
*/
