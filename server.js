const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = express();

mongoose.connect("mongodb://jvok44:mva020406@ac-pcgkcbz-shard-00-00.hs2bjrx.mongodb.net:27017,ac-pcgkcbz-shard-00-01.hs2bjrx.mongodb.net:27017,ac-pcgkcbz-shard-00-02.hs2bjrx.mongodb.net:27017/?ssl=true&replicaSet=atlas-kc2qni-shard-0&authSource=admin&appName=Cluster0")
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('register');
});


const User = require('./models/User');

app.use(express.urlencoded({ extended: true }));

app.post("/", async (req, res) => {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        return res.redirect("/");
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

app.get('/', (req, res) => {
    res.render('register');
});
app.post('/', async (req, res) => {
    const { username, email, password } = req.body;
    const newUser = new User({ 
        username,
        email,
        password
    });
    await newUser.save();
    res.redirect("/login");
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
    res.redirect("/index");
});

app.use((req, res) => {
    res.send("Página não encontrada");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

