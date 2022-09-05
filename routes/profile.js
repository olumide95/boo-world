'use strict';

const express = require('express');
const router = express.Router();
const { Profile } = require("../models.js")

module.exports = function() {

  router.get('/:id', async function(req, res, next) {
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

  return router;
}

