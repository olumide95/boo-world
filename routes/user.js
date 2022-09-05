'use strict';

const express = require('express');
const router = express.Router();
const { User } = require("../models.js")
const { body,  validationResult } = require('express-validator');

module.exports = function() {

  router.post('/',
    body('name', 'Name is required').exists(),
    async function(req, res) {
        
        const errors = validationResult(req);
 
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
            
        const { name } = req.body

        const user = await (new User({name}).save())

        return res.status(201).json({
            message: "User created successfully.",
            status: true,
            user
        })
    });

  return router;
}

