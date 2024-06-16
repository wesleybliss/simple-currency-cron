const pkg = require('../package.json')

module.exports = (req, res) => {
    
    res.status(200).json({
        [pkg.name]: pkg.version,
    })
    
}
