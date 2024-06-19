const router = require('express').Router()
const Signup = require('../models/signup.model')


router.route('/').get((req, res) => {
    Signup.find()
    .then(examples => res.json(examples))
    .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/add').post((req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const date = Date.parse(req.body.date);


  const newExample = new Signup({
    fullname,
    mobile,
    password,
    confirmpassword
  });


  newExample.save()
    .then(() => res.json('Example added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});


module.exports = router;