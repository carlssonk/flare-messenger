module.exports.userSchema = {
  username: {
    in: ["body"],
    isString: true,
    isLength: {
      options: { min: 3, max: 20 },
      errorMessage: "Username must be between 3 and 20 characters long.",
      bail: true,
    },
    matches: {
      options: /^\w+$/,
      errorMessage:
        "Username can only contain letters, numbers and underscores.",
    },
    errorMessage: "Username is invalid.",
  },

  email: {
    in: ["body"],
    isString: true,
    isEmail: true,
    errorMessage: "Enter a valid email address.",
  },

  password: {
    in: ["body"],
    isString: true,
    isLength: {
      options: { min: 6, max: 128 },
      errorMessage: "Password must be between 6 and 128 characters long.",
    },
    errorMessage: "Password is invalid.",
  },
};
