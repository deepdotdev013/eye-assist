const { VALIDATOR, VALIDATION_EVENTS, USER_ROLES } =
  require('../../config/constants').constants;

// Create a function to validate the data.
const validateUserData = (bodyData) => {
  let rules = {};

  // Validate the data according to the eventCode.
  switch (bodyData.eventCode) {
    case VALIDATION_EVENTS.SignUpUserEmail: {
      // Define the rules
      rules = {
        email: 'email|required',
        password: [
          'string',
          'required',
          'regex:/^(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).{8,}$/',
        ],
        confirmPassword: [
          'string',
          'required',
          'regex:/^(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).{8,}$/',
        ],
        username: 'string|required|regex:^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$',
        firstName: 'string|required',
        lastName: 'string',
        role: [
          'string',
          'required',
          { in: [USER_ROLES.Scribe, USER_ROLES.Student] },
        ],
      };
      break;
    }

    case VALIDATION_EVENTS.VerifyUserEmail: {
      // Define the rules
      rules = {
        token: 'string|required',
      };
      break;
    }

    case VALIDATION_EVENTS.SignInUserEmail: {
      // Define the rules
      rules = {
        email: 'email|required',
        password: [
          'string',
          'required',
          'regex:/^(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).{8,}$/',
        ],
      };
      break;
    }

    case VALIDATION_EVENTS.OnBoardUser: {
      // Define the rules
      rules = {
        isPageSkipped: 'boolean|required',
        stepComplete: 'integer|required',
        dob: 'date',
        age: 'integer',
        gender: 'string',
        country: 'string',
        mobileNumber: 'string',
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

module.exports = { validateUserData };
