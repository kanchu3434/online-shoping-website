import express from 'express'
import mongoose from "mongoose"
import dotenv from 'dotenv'
dotenv.config();

import User from './models/User.js';


const app = express();
// middleware
app.use(express.json());

const PORT = process.env.PORT || 5000;





app.post('/signup', async (req, res) => {

    const { name, email, phone, password, role } = req.body;


   
    

    const emptyFields = [];
    if (!name) emptyFields.push('name');
    if (!email) emptyFields.push('email');
    if (!phone) emptyFields.push('phone');
    if (!password) emptyFields.push('password');
    if (!role) emptyFields.push('role');

    if (emptyFields.length > 0) {
        return res.json({
            success: false,
            message: `${emptyFields.join(',')} are required`
        })
    }
    // validation to check if all fields are filled ends here

    // validation to check if email already exists start here
    const existingUser = await  User.findOne({ email: email });
    if (existingUser) {
        return res.json({
            success: false,
            message: "email already exists"
        })
    }
    // validation to check if email already exists ends here

    // validation to check if phone already exists satrt here
    const existingUserPhone = await  User.findOne({ phone: phone });
    if (existingUserPhone) {
        res.json({
            success: false,
            message: "phone is already exists"
        })
    }

    // validation to check if phone already exists ends here


    const user = new User({
        name: name,
        email: email,
        phone: phone,
        password: password,
        role: role
    })

    const savedUser = await user.save();
    res.json({
        success: true,
        message: "user created successfully",
        data: savedUser
    })

})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({
            success: false,
            message: "Email and password are required"
        })
    }
    const existingUser = await User.findOne({ email: email, password: password });
    if (existingUser) {
        return res.json({
            success: true,
            message: "Login Successfully",
            data: existingUser
        })
    }
    else {
        return res.json({
            success: false,
            message: "Invalid email or password"
        })
    }
})




app.listen(PORT, () => {
    console.log("server is running on port 5000")
})