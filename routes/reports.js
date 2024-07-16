const express = require('express')
const router = express.Router();

const { isLoggedIn, getCurrentPlantandInstructions, isAdmin } = require('../middleware');
const { editDueDate, renderReport } = require('../controllers/reports');

router.route('/:plantID')
    .get(isLoggedIn, getCurrentPlantandInstructions, renderReport);

router.route('/:plantID/editDueDate')
    .post(isLoggedIn, isAdmin, getCurrentPlantandInstructions, editDueDate)

module.exports = router;