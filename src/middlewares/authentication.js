const axios = require('axios');

const logManager = require('../helpers/logger.js');

const Kratos = require('../helpers/kratos.js');
const kratos = new Kratos(process.env.KRATOS, process.env.KRATOS_ADMIN);

async function authentication (req, res, next) {

  // AuthN

  let logger = logManager.createLogger('AuthN:main');
  logger.debug('Auth request for user ', req.body.user);

  try {
    let authn = await kratos.loginApiFlow(req, res);

    if (authn.status !== 200) {
      // AuthN failed
      logger.info('Failed to authenticate user ', req.body.user);
      // TODO: use next(error);
      res.status(200).json({ result: false });
    } else {
      // AuthN OK
      logger.info('User ', req.body.user, ' authenticated');
      req.locals = { "result": true };
      req.locals.info = authn.data.session.identity.traits;
      req.locals.info.id = authn.data.session.identity.id;
      req.locals.info.schema_id = authn.data.session.identity.schema_id;

      // Run next middleware
      next();
    }
  } catch(e) {
    if ( e.appClass === 'Kratos:loginApiFlow' ) {
      logger.info(e.appMessage);
      logger.info(JSON.stringify(e));
      res.status(200).json({ result: false });
    } else if ( e.appClass === 'Kratos:initLoginFlow' ) {
      logger.error(e.appMessage);
      logger.error(JSON.stringify(e));
      res.status(500).end();
    } else {
      logger.error('Unexpected error');
      logger.error(JSON.stringify(e));
      res.status(500).end();
    }
  }
}

module.exports = authentication;
