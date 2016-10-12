const through2 = require('through2')

function parseJson(text){
    if(!text || typeof(text) !== 'string' || text.charAt(0) !== '{' || text.charAt(text.length - 1) !== '}'){
        return null
    }
    try{
        return JSON.parse(text)
    }catch(e){
        //console.log(e)
        return null
    }
}

function buildInfluxPoint(obj, tagKeys){
    if(!obj || !obj.time){
        return null
    }
    const tags = tagKeys.reduce((sum, tag) => {
        sum[tag] = obj[tag]
        return sum
    }, {})
    const fields = Object.keys(obj).reduce((sum, key) => {
        if(!tags[key]){
            sum[key] = obj[key]
        }
        return sum
    }, {})
    return [fields, tags]
}



module.exports = function transform(tags, mesearment){
    return through2.obj(function transformer(textLine, enc, cb) {
        const obj = parseJson(textLine)
        const influxPoint = buildInfluxPoint(obj, tags, mesearment)
        if(influxPoint){
            this.push(influxPoint)
        }
        cb()
    })
}