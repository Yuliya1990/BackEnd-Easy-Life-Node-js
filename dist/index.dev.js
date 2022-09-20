"use strict";

var express = require('express');

var router = express.Router();

var nodemailer = require('nodemailer');

var cors = require('cors');

var creds = require('./config');

var transport = {
  host: 'smtp.gmail.com',
  // Don’t forget to replace with the SMTP host of your provider
  port: 587,
  auth: {
    user: creds.USER,
    pass: creds.PASS
  }
};
var transporter = nodemailer.createTransport(transport);
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});
router.post('/send', function (req, res, next) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;
  var role = req.body.role;
  var message = 'This is your new user';
  var content = " message: ".concat(message, " \n first name: ").concat(firstName, " \n last name: ").concat(lastName, " \n email: ").concat(email, " \n role: ").concat(role, " ");
  var mail = {
    from: firstName + ' ' + lastName,
    to: 'testapismtp@gmail.com',
    // Change to email address that you want to receive messages on
    subject: 'New Message from Contact Form',
    text: content
  };
  transporter.sendMail(mail, function (err, data) {
    if (err) {
      res.json({
        status: 'fail'
      });
    } else {
      res.json({
        status: 'success'
      });
    }
  });
  transporter.sendMail({
    from: 'testapismtp@gmail.com',
    to: email,
    subject: 'Submission was successful',
    text: "Thank you for contacting us!\n\nForm details\n first name: ".concat(firstName, " \n last name: ").concat(lastName, " \n email: ").concat(email, " \n role: ").concat(role, " ")
  }, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Message sent: ' + info.response);
    }
  });
});
var app = express();
app.use(cors());
app.use(express.json());
app.use('/', router);
app.listen(3002);