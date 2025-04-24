const { VALIDATOR, VALIDATION_EVENTS, USER_ROLES } =
  require('../../config/constants').constants;

// Create a function to validate the data.
const validateQualificationData = (bodyData) => {
  let rules = {};

  // Validate the data according to the eventCode.
  switch (bodyData.eventCode) {
    case VALIDATION_EVENTS.CreateQualificationStream: {
      // Define the rules
      rules = {
        qualification: 'string',
        stream: 'string',
        parentQualificationId: 'string',
      };
      break;
    }

    case VALIDATION_EVENTS.GetAllStreams: {
      // Define the rules
      rules = {
        qualificationId: 'string|required',
        role: [
          'string',
          'required',
          { in: [USER_ROLES.Scribe, USER_ROLES.Student] },
        ],
      };
      break;
    }
    default:
      break;
  }

  // Validate the data on the defined rules.
  const validation = new VALIDATOR(bodyData, rules);

  // If validation fails, set the error.
  if (validation.fails()) {
    return {
      hasError: true,
      errors: validation.errors.all(),
    };
  }

  // Else do not send any error.
  return {
    hasError: false,
    errors: null,
  };
};

module.exports = { validateQualificationData };
