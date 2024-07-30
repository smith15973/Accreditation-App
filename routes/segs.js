const express = require('express')
const router = express.Router();
const { isLoggedIn, isAdmin, validateSegInstruction } = require('../middleware');
const { renderCreateNewSegTemplate, createNewSegTeamplate, renderEditSegTemplate, editSegTemplate, deleteSegTemplate, checkForSeg } = require('../controllers/segs');



router.route('/instruction/new')
    .get(isLoggedIn, isAdmin, renderCreateNewSegTemplate)
    .post(isLoggedIn, isAdmin, validateSegInstruction, createNewSegTeamplate)

router.route('/instruction/:segInstructionID')
    .get(isLoggedIn, isAdmin, renderEditSegTemplate)
    .put(isLoggedIn, isAdmin, validateSegInstruction, editSegTemplate)
    .delete(isLoggedIn, isAdmin, deleteSegTemplate)

module.exports = router;