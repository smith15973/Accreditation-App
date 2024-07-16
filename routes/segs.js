const express = require('express')
const router = express.Router();
const { isLoggedIn, isAdmin } = require('../middleware');
const { renderCreateNewSegTemplate, createNewSegTeamplate, renderEditSegTemplate, editSegTemplate } = require('../controllers/segs');


router.route('/instruction/new')
    .get(isLoggedIn, isAdmin, renderCreateNewSegTemplate)

    .post(isLoggedIn, isAdmin, createNewSegTeamplate)


router.route('/instruction/:segInstructionID')
    .get(isLoggedIn, isAdmin, renderEditSegTemplate)
    .put(isLoggedIn, isAdmin, editSegTemplate)

module.exports = router;