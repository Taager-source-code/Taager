const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); 

console.log('Running custom webpack config...')

module.exports = {
    optimization: {
        moduleIds: 'deterministic',
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            },
            minChunks: 4,
            maxSize: 200000,
            minSize: 1000
        },
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(), 
        ]
    }
}


