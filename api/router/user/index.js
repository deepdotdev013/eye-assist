const { EXPRESS } = require("../../../config/constants").constants;
const ROUTER = EXPRESS.Router();
const AuthRoute = require("./AuthRoute");

ROUTER.use("/", AuthRoute);

module.exports = ROUTER;
