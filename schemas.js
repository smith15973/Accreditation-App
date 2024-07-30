const Joi = require('joi');
module.exports.plantSchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.object({
        location: Joi.string().required(),
        originalName: Joi.string().required(),
        key: Joi.string().required(),
        bucket: Joi.string().required(),
    })
});

module.exports.dueDateSchema = Joi.object({
    dateTeam: Joi.string().required(),
    Incomplete: Joi.date(),
    Uploaded: Joi.date(),
    Reviewed: Joi.date(),
    Approved: Joi.date(),
    Submitted: Joi.date(),
});


module.exports.segInstructionSchema = Joi.object({
    team: Joi.string().required(),
    department: Joi.string().required(),
    segNum: Joi.number().required(),
    applicableAOC: Joi.string(),
    reviewActivity: Joi.string(),
    dataSubmittal: Joi.string(),
    reviewGuidance: Joi.string(),
    programs: Joi.array(),
});




