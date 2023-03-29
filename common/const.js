module.exports = {
  ERROR: {
    invalidHashFunc: {
      status: 400,
      error: "invalid-hash-function",
      message: "the hash function specified is not valid",
    },

    missingTextParam: {
      status: 400,
      error: "missing-text-param",
      message: "the text parameter was not provided for `/api/hash`",
    },
  },

  PORT: process.env.PORT || 4000,
};
