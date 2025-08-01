const express = require('express')
var cors = require('cors')

const app = express()
const port = 3000

app.use(cors())

app.get('/', (req, res) => {
  res.send({
    body: "Alexander Leino"
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
