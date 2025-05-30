import pkg from '../package.json'

export default (req, res) => {
    
    res.status(200).json({
        name: pkg.name,
        version: pkg.version,
    })
    
}
