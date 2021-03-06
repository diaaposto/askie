"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    let templateVars = {
      question: req.session.question,
      voting_url: req.session.voting_url,
      results_url: req.session.results_url
    }
    res.render("done", templateVars)
  });

  router.get(/.*/, (req, res) => {
    res.redirect("/error");
  });

  return router;
}