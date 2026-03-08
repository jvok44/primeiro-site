const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/teste')
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index');
});


const User = require('./models/User');

app.use(express.urlencoded({ extended: true }));

app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        return res.redirect("/register");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword
    });
    await newUser.save();
    res.redirect("/login");
});

app.get('/register', (req, res) => {
    res.render('register');
});
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const newUser = new User({ 
        username,
        email,
        password
    });
    await newUser.save();
    res.redirect("/register");
    });

app.get('/login', (req, res) => {
    res.render('login')
});
app.post('/login', async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email: email});

    if (!user) {
        return res.redirect("/login");
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.redirect("/login");
    }
    res.redirect("/");
});

app.use((req, res) => {
    res.send("Página não encontrada");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

