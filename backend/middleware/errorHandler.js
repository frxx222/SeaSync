import logEvents from './logger'

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
    console.log(err.stack)

    const status = res.status.Code ? res.statusCode : 500 //server error

    res.status(status)

    res.json({ meesage: err.message })
}

export default errorHandler