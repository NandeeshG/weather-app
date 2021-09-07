//const chalk = require('chalk')

function convertToDate(dt) {
    const date = new Date(dt * 1000)
    return (
        ('0' + date.getDate()).substr(-2) +
        '/' +
        ('0' + date.getMonth()).substr(-2) +
        '/' +
        date.getFullYear() +
        ' @ ' +
        ('0' + date.getHours()).substr(-2) +
        ':' +
        ('0' + date.getMinutes()).substr(-2) +
        ':' +
        ('0' + date.getSeconds()).substr(-2)
    )
}

/*
function printCity(city) {
    console.log(chalk.cyanBright.inverse(`Details of ${city.toUpperCase()}`))
}

function printData(city, data) {
    printCity(city)
    for (let d in data) printPair(d, data)
    //console.log(chalk.blueBright(d), ': ', chalk.green.italic(data[d]))
}

function printPair(item, obj, prefix = '') {
    if (typeof obj[item] === 'object') {
        for (const i in obj[item]) printPair(i, obj[item], prefix + ' ' + item)
    } else {
        const value = specialTransform(item, obj[item])
        if (value.length > 0)
            console.log(
                chalk.blueBright(prefix, item),
                ': ' + chalk.green.italic(value)
            )
    }
}
*/

function specialTransform(name, value) {
    if (['sunrise', 'sunset', 'moonrise', 'moonset', 'dt'].includes(name))
        return convertToDate(value)
    else if (
        [
            'day',
            'eve',
            'min',
            'max',
            'night',
            'eve',
            'temp',
            'temp_min',
            'temp_max',
            'feels_like',
            'morn',
            'dew_point',
        ].includes(name)
    )
        return `${value} \xB0C`
    else if (['pressure', 'sea_level', 'grnd_level'].includes(name))
        return `${value} hPa`
    else if (['wind_speed', 'wind_gust', 'speed', 'gust'].includes(name))
        return `${value} m/s`
    else if (['cloud','clouds', 'humidity'].includes(name)) return `${value} %`
    else if (['precipitation'].includes(name)) return `${value} mm`
    else if (['visibility'].includes(name)) return `${value} m`
    else if (['pop'].includes(name)) return `${value} prob of rain`
    //else if ([/*'timezone',*/ 'cod', 'id', 'base', 'icon'].includes(name)) return ''
    else return `${value}`
}

exports.module = {
    convertToDate,
    //printCity,
    //printData,
    //printPair,
    specialTransform,
}
