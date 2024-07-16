const catchAsync = require('../utils/catchAsync');


const { upload, deleteFiles } = require('../utils/fileOperations');
const { isLoggedIn } = require('../middleware');


module.exports.renderSAMatrix = (req, res) => {
    res.render('saMatrix');
};

