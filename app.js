import e from "express";
import cors from 'cors';
import * as db from './data/db.js';
import bcrypt from 'bcrypt';
import res from "express/lib/response.js";

const PORT = 3000;

const app = e();

app.use(e.json());
app.use(cors());
app.use(e.static('public'));

app.get('/users', (req,res) => {
    const users = db.getUsers();
    res.json(users)
})

app.get('/users/:id', (req,res) => {
    const user = db.getUserById(+req.params.id)
    if (!user) {
        return res.status(404).json({message:"User not found"})
    }
    res.json(user)
})

app.post('/users/', async (req,res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({message:"Missing data"})
    }
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    const saved = db.saveUser(email, hashedPassword)
    const user = db.getUserById(saved.lastInsertRowid)
    res.status(201).json(user)
})

app.post('/login', (req,res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({message:"Invalid credentials"})
    }
    const user = db.getUserByEmail(email)
    if (!user) {
        return res.status(400).json({message:"Invalid credentials"})
    }
    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({message:"Invalid credentials"})
    }
    res.status(200).json(user)
})

app.put('/users/:id', (req,res) => {
    const id = +req.params.id;
    let user = db.getUserById(id);
    if (!user) {
        return res.status(404).json({message:"User not found"})
    }
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({message:"Missing data"})
    }
    const salt =  bcrypt.genSaltSync()
    const hashedPassword =  bcrypt.hashSync(password, salt)
    db.updateUser(id, email, hashedPassword);
    user = db.getUserById(id);
    res.status(200).json(user);
})

app.delete('/users/:id', (req,res) => {
    const id = +req.params.id
    const user = db.getUserById(id)
    if (!user) {
        return res.status(404).json({message:"User not found"})
    }
    db.deleteUser(id)
    res.json({message: "Deleted successfully"})
})

app.listen(PORT, () => {
    console.log(`Serer runs on port ${PORT}`)
})