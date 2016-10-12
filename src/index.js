const pump = require('pump')
const split2 = require('split2')
const pick = require('lodash.pick')
const argv = require('yargs')
    .usage('$0 --url http://server.domain:8086')
    .env('PINO_INFLUXDB')
    .help()
    .version(function () {
        return require('../package.json').version
    })
    .options({
        echo: {
            default: true,
            type: 'boolean',
            description: 'Echo the l'
        },
        mesearment: {
            default: 'log',
            requiresArg: true,
            description: 'The mesearment name'
        },
        database: {
            default: 'logs',
            requiresArg: true,
            description: 'The database name. Will be created if missing.'
        },
        host: {
            alias: 'hosts',
            array: true,
            default: 'http://localhost:8086',
            requiresArg: true,
            describe: 'One or more influx db host urls.'
        },
        tags: {
            array: true,
            default: ['pid', 'hostname', 'level'],
            requiresArg: true,
            describe: 'List of tags'
        }
    })
    .argv


const transform = require('./lib/transform')
const transport = require('./lib/transport')

const transformToInfluxPoint = transform(Array.from(argv.tags))
const transportPoints = transport(pick(argv, ['hosts', 'database', 'mesearment']))

pump(process.stdin, split2(), transformToInfluxPoint, transportPoints)



