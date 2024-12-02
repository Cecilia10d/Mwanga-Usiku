require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
});
app.use(limiter);

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.ADMIN_EMAIL) {
    console.error('Environment variables EMAIL_USER, EMAIL_PASS, or ADMIN_EMAIL are not set.');
    process.exit(1);
}


mongoose.connect('mongodb://localhost:27017/donationApp')
    .then(function () {
        console.log('Connected to the database');
    })
    .catch(function (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    });

const Contact = mongoose.model('Contact', new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, match: /.+\@.+\..+/ },
    message: { type: String, required: true },
}));

const Donor = mongoose.model('Donor', new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, match: /.+\@.+\..+/ },
    amount: { type: Number, required: true, min: 1 },
    date: { type: Date, default: Date.now },
}));


let transporter;
try {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS, 
        }
    });
} catch (err) {
    console.error('Error setting up email transporter:', err);
    process.exit(1);
}


app.post('/contact', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('message').notEmpty().withMessage('Message is required'),
], async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, message } = req.body;
    try {
        const contact = new Contact({ name, email, message });
        await contact.save();

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: 'New Contact Form Submission',
            text: 'Name: ' + name + '\nEmail: ' + email + '\nMessage: ' + message
        });

        res.status(200).send('Message received!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error processing the request.');
    }
});


app.post('/donate', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('amount').isFloat({ min: 1 }).withMessage('Donation amount must be at least 1'),
], async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, amount } = req.body;
    try {
        const donor = new Donor({ name, email, amount });
        await donor.save();

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank You for Your Donation',
            text: 'Dear ' + name + ',\n\nThank you for your generous donation of $' + amount + '. We deeply appreciate your support.\n\nBest regards,\n[Your Organization Name]'
        });

        res.status(200).send('Donation processed and thank-you email sent!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error processing the donation.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log('Server running on http://localhost:' + PORT);
});
 