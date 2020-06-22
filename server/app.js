const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 3000
const {MONGOURI} = require('./keys')

require('./models/user')
app.use(express.json())
app.use(require('./routes/auth'))


mongoose.connect(MONGOURI, {
    useNewUrlParser:true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected', ()=>{
    console.log('connected')
})

mongoose.connection.on('error', ()=>{
    console.log('error')
})


app.listen(PORT, () => {
    console.log('App listening on port ', PORT);
});