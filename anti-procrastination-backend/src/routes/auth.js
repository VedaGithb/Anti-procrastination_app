import express from "express";
import mongoose from "mongoose";

const router = express.Router();
import User from '../models/User.js';
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

router.post('/register', async (req, res) => {
    const {username, email, password} = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        passwordHash: hash,
    });

    res.json(user);
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).send("Missing data")
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).send("User not found");
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
        return res.status(400).send("Wrong password");
    }

    const token = jwt.sign({
        id: user._id,
    }, 'secret');

    res.json(token);
})

export default router;