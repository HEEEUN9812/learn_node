
const express = require('express')
const app = express()
const port = 3000

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { User } = require("./models/User");

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/node', {
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

app.post('/login', (req, res) => {
    try {
        const user = User.findOne({email:req.body.email});

        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            });
        }

        const isMatch = user.comparePassword(req.body.password);

        if(!isMatch) {
            return res.json({
                loginSuccess: false,
                message: "비밀번호가 틀렸습니다."
            });
        }

        const token = user.generateToken();

        res.cookie("x_auth", token)
        .status(200)
        .json({
            loginSuccess: true,
            userId: user._id
        });
    } catch (err) {
        return res.status(500).json({
            loginSuccess: false,
            message: err.message
        });
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})