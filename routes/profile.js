'use strict';

const express = require('express');
const router = express.Router();
const { Profile } = require("../models.js")
const { body,  validationResult } = require('express-validator');

module.exports = function() {

  router.get('/:id', async function(req, res) {
    const { id }  = req.params 
    const profile = await Profile.findOne({})

    if(!profile){
      return res.status(404).json({
        message: `No profile with id (${id}) found`,
        status: false
       })
    }

    return res.render('profile_template', {
      profile: profile,
    });

  });

  router.post('/',
    body('name', 'Name is required').exists(),
    body('description', 'Ddescription is required').exists(),
    body('mbti', 'mbti is required').exists(),
    body('variant', 'Variant is required').exists(),
    body('tritype').exists().withMessage('Tritype is required').isNumeric().withMessage('Tritype must be a number'),
    body('socionics', 'Socionics is required').exists(),
    body('sloan', 'Sloan is required').exists(),
    body('psyche', 'Psyche is required').exists(),
    async function(req, res) {
        
        const errors = validationResult(req);
 
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
            
        const { name, description, mbti, enneagram, variant, tritype, socionics, sloan, psyche } = req.body
        const image = 'https://soulverse.boo.world/images/1.png';

        const profile = await (new Profile({name, description, mbti, enneagram, variant, tritype, socionics, sloan, psyche, image}).save())

        return res.status(201).json({
            message: "Profile created successfully.",
            status: true,
            profile
        })
    });

  return router;
}

