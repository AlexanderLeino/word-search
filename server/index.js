const express = require('express')
var cors = require('cors')
require("dotenv").config()
const app = express()
const port = 3000

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }));

app.get('/:word', async (req, res) => {

  try {
  console.log(`${req.params.word}`)
  console.log(process.env.WEBSTER_DICTIONARY_KEY)
  let response = await fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${req.params.word}?key=${process.env.WEBSTER_DICTIONARY_KEY}`)
  console.log(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/#2
  ice?key=${process.env.WEBSTER_DICTIONARY_KEY}`)
  let data = await response.json()
  console.log(data)
  res.send(data)
  } catch (e) {
    console.log(e)
    res.send(e)
  }
  
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
