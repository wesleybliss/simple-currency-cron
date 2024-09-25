import * as kv from '../lib/kv'

const allowedKeys = ['currencies', 'pairs']

module.exports = async (req, res) => {
    
    try {
        
        const { key } = req.query
        
        if (!allowedKeys.includes(key)) {
            console.warn(`clear: not allowed key: "${key}" in ${allowedKeys}`)
            return res.status(401).json({})
        }
        
        await kv.deleteByKey(key)
        
        res.status(200).json({ cleared: key })
        
    } catch (e) {
        
        res.status(500).json({
            error: e.message,
        })
        
    }
    
}
