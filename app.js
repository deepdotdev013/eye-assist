// Load environment variables
require('dotenv').config();

// Load modules
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const CORS = require('cors');
const { createServer } = require('http');
const { I18n } = require('i18n');

// Load utilities
const session = require('express-session');

// Load routes and configs
const userRoutes = require('./api/router/user');
const { locales, defaultLocale } = require('./config/i18n');
const { cors } = require('./config/security');
const sessionMiddleware = require('./config/session');
const { sequelize } = require('./api/models');
const { startServer } = require('./api/utils/listenServer');

// Initialize i18n
const i18n = new I18n({
  locales,
  directory: __dirname + '/config/locales',
  defaultLocale,
  objectNotation: true,
});

// Create Express app
const app = express();
const server = createServer(app);

// Session setup
app.use(sessionMiddleware);

// Middleware
app.use(CORS(cors));
app.use(morgan(process.env.MORGAN_FORMAT));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(i18n.init);

// Routes
app.use('/api/user', userRoutes);

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, async () => {
  await startServer(server, sequelize, PORT);
});
