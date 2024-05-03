module.exports = {
    apps: [
        {
            name: 'AIproject',
            port: '3010',
            exec_mode: 'cluster',
            instances: 'max',
            script: './.output/server/index.mjs'
        }
    ]
}
