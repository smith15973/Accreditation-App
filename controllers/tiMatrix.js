
const catchAsync = require('../utils/catchAsync');


const { upload, deleteFiles } = require('../utils/fileOperations');
const { isLoggedIn } = require('../middleware');



module.exports.renderTIMatrix = (req, res) => {
    res.render('tiMatrix');
};
