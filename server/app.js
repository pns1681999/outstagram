const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 3000
const {MONGOURI} = require('./keys')



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

require('./models/user')
require('./models/post')
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))


app.listen(PORT, () => {
    console.log('App listening on port ', PORT);
});