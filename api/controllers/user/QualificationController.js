const { RESPONSE_CODES, VALIDATION_EVENTS, UUID, USER_ROLES } =
  require('../../../config/constants').constants;
const {
  validateQualificationData,
} = require('../../validations/QualificationValidation');
const { HighestQualificationStream } = require('../../models');

module.exports = {
  /**
   * @name createQualificationStream
   * @path /user/qualification/create
   * @method POST
   * @schema HighestQualificationStream
   * @param {string} - req.body.qualification - Qualification of the user
   * @param {string} - req.body.stream - Stream of the user
   * @param {string} - req.body.parentQualificationId - Id of the parent qualification
   * @description This method is used to create qualifications and streams in the database.
   * @returns {Object} JSON object containing the user data
   * @author Deep Panchal
   */
  createQualificationStream: async (req, res) => {
    try {
      // Create the bodyData
      const bodyData = {
        qualification: req.body.qualification,
        stream: req.body.stream,
        parentQualificationId: req.body.parentQualificationId,
        eventCode: VALIDATION_EVENTS.CreateQualificationStream,
      };

      // Validate the incoming data
      const result = validateQualificationData(bodyData);

      // If the validation fails, send an error
      if (result.hasError) {
        return res.status(RESPONSE_CODES.BadRequest).json({
          status: RESPONSE_CODES.BadRequest,
          message: req.__('VALIDATION_ERROR'),
          error: result.errors,
        });
      }

      if (bodyData.qualification) {
        const existingQualification = await HighestQualificationStream.findOne({
          where: {
            isDeleted: false,
          },
          order: [['value', 'DESC']],
        });

        await HighestQualificationStream.create({
          id: UUID.v4(),
          qualification: bodyData.qualification,
          value: existingQualification?.value
            ? existingQualification?.value + 1
            : 1,
          stream: null,
          parentQualificationId: null,
        });
      }
      if (bodyData.stream) {
        const existingStream = await HighestQualificationStream.findOne({
          where: {
            stream: bodyData.stream,
            parentQualificationId: bodyData.parentQualificationId,
            isDeleted: false,
          },
        });
        if (!existingStream) {
          await HighestQualificationStream.create({
            id: UUID.v4(),
            qualification: null,
            value: null,
            stream: bodyData.stream,
            parentQualificationId: bodyData.parentQualificationId,
          });
        }
      }

      // Success Response
      return res.status(RESPONSE_CODES.Created).json({
        status: RESPONSE_CODES.Created,
        message: req.__('QUALIFICATION_STREAM_CREATED_SUCCESSFULLY'),
        data: null,
      });
    } catch (error) {
      console.log('error: ', error);
      return res.status(RESPONSE_CODES.ServerError).json({
        status: RESPONSE_CODES.ServerError,
        message: req.__('WENTS_WRONG'),
        data: null,
      });
    }
  },

  /**
   * @name getAllHighestQualification
   * @path /user/qualification/all-qualifications
   * @method GET
   * @schema HighestQualificationStream
   * @description This method is used to fetch all the highest qualifications from the database.
   * @returns {Object} JSON object containing the qualification data
   * @author Deep Panchal
   */
  getAllHighestQualification: async (req, res) => {
    try {
      // Fetch all the highest qualifications from the database.
      const allHighestQualification =
        await HighestQualificationStream.findAndCountAll({
          where: {
            isDeleted: false,
            stream: null,
            parentQualificationId: null,
          },
          attributes: ['id', 'qualification', 'value'],
          order: [['value', 'ASC']],
        });

      // Success Response
      return res.status(RESPONSE_CODES.Ok).json({
        status: RESPONSE_CODES.Ok,
        message: null,
        data: allHighestQualification || {},
      });
    } catch (error) {
      console.log('error: ', error);
      return res.status(RESPONSE_CODES.ServerError).json({
        status: RESPONSE_CODES.ServerError,
        message: req.__('WENTS_WRONG'),
        data: null,
      });
    }
  },

  /**
   * @name getAllStreams
   * @path /user/qualification/all-streams
   * @method GET
   * @schema HighestQualificationStream
   * @param {string} - req.query.qualificationId - Id of the qualification
   * @param {string} - req.query.role - Role of the user (Student or Scribe)
   * @description This method is used to fetch all the streams based on the role.
   * @returns {Object} JSON object containing the stream data
   * @author Deep Panchal
   */
  getAllStreams: async (req, res) => {
    try {
      // Create the queryData
      const queryData = {
        qualificationId: req.query.qualificationId,
        role: req.query.role,
        eventCode: VALIDATION_EVENTS.GetAllStreams,
      };

      // Validate the incoming data
      const result = validateQualificationData(queryData);

      // If the validation fails, send an error
      if (result.hasError) {
        return res.status(RESPONSE_CODES.BadRequest).json({
          status: RESPONSE_CODES.BadRequest,
          message: req.__('VALIDATION_ERROR'),
          error: result.errors,
        });
      }

      // Build a dynamic where condition based on the role and qualificationId
      const whereCondition = {
        parentQualificationId: queryData.qualificationId,
        isDeleted: false,
        value: null,
      };

      // If the role is 'Student', add the condition to fetch eligible streams
      if (queryData.role === USER_ROLES.Student) {
        whereCondition.eligibleForStudent = true;
      }

      // Fetch all the streams from the database.
      const allStreams = await HighestQualificationStream.findAndCountAll({
        where: whereCondition,
        attributes: ['id', 'stream'],
        order: [['stream', 'ASC']],
      });

      // Success Response
      return res.status(RESPONSE_CODES.Ok).json({
        status: RESPONSE_CODES.Ok,
        message: null,
        data: allStreams || {},
      });
    } catch (error) {
      console.log('error: ', error);
      return res.status(RESPONSE_CODES.ServerError).json({
        status: RESPONSE_CODES.ServerError,
        message: req.__('WENTS_WRONG'),
        data: null,
      });
    }
  },
};
