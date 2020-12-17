const express = require('express')
const compression = require('compression')

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 8080

const app = express()

app.set('host', host)

app.set('port', port)

app.use(compression())

// NOTE: ping
app.get('/ping', function (req, res) {
  res.send('Hello World')
})


app.use('/', express.static('./demo'))
// app.use('/assert', express.static('./dist/click-tracker-element2'))
// app.use('/pantheon/avengers/avengers/\*', express.static('./dist/avengers/'))


app.listen(app.get('port'), app.get('host'), function () {
  console.log(
    'notice',
    `Amos Server listening on http://${host}:${port}`
  )
  console.log('notice', `[CLUSTER] Worker ${process.pid} is running`)
})

