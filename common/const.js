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

    missingHashParam: {
      status: 400,
      error: "missing-hash-param",
      message: "the hash parameter was not provided for `/api/crack`",
    },

    internalErr:  {
      status: 500,
      error: "internal-error",
      message: "something went wrong internally",
    }
  },

  crackAlgorithms: ["sha1", "sha256", "md5"],

  PORT: process.env.PORT || 3000,
};
