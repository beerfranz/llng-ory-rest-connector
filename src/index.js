const express = require('express')

const middlewareAuthentication = require('./middlewares/authentication.js');
const middlewareAuthorization = require('./middlewares/authorization.js');

const logManager = require('./helpers/logger.js');

const serverLog = logManager.createLogger('Server');

const app = express()
const port = process.env.PORT

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication endpoint
// request: { "user": "$user", "password": "$password" }
// result: { "result": true/false, "info": { "lastname": string, "firstname": string, "acl_xx_yy": string, ...} }
app.post('/auth', 
  middlewareAuthentication,
  middlewareAuthorization,
  (req, res) => {
    res.status(200).json(req.locals);
  }
);

// User info endpoint
// req: { "user": "$user" }
// res: { "result": true/false, "info": {} }
app.post('/userinfo', (req, res) => {
  // Impossible to get user info without knowing its password.
  // The request must contain the current password, not only the user name.
  res.status(500).end();
})

// Password confirmation endpoint
// req: { "user": "$user", "password": "$password" }
// res: { "result": true/false }
app.post('/confirm-password',
  middlewareAuthentication,
  (req, res) => {
    res.status(200).json(req.locals);
  }
)

// Password change endpoint
// req: { "user": "$user", "password": "$password" }
// res: { "result": true/false }
app.post('/change-password', (req, res) => {
  // Impossible to change password without an authentication before.
  // The request must contain the current password, not only the new password.
  res.status(500).end();
})

app.listen(port, () => {
  serverLog.info('Listen on port ', port);
  serverLog.info('Log level: ', process.env.LOG_LEVEL);
})
