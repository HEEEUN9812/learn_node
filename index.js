
const express = require('express')
const app = express()
const port = 3000

const bodyParser = require('body-parser');
const{User} = require("./models/User");

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// application/json
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/node',{
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected..'))
  .catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        return res.status(200).json({
            success: true
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            err: err.message || 'Server Error'
        })
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})