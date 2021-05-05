const axios = require('axios');

const logManager = require('../helpers/logger.js');

const Keto = require('../helpers/keto.js');
const keto = new Keto(process.env.KETO);

async function authorization (req, res, next) {

  // AuthZ

  let logger = logManager.createLogger('AuthZ:main');
  try {
    logger.debug('Request authorizations for user ', req.body.user, ', ID: ', req.locals.info.id);
    let authz = await keto.getAcl(req.locals.info.id);

    logger.debug('Get response from Keto');

    if (authz.data.relation_tuples.length === 0) {
      logger.debug('No ACL found for user ', req.body.user);
    } else {
      authz.data.relation_tuples.forEach(acl => {
        logger.debug('Add ACL in namespace ', acl.namespace, ' on object ', acl.object);
        req.locals.info['acl_' + acl.namespace + '_' + acl.object] = acl.relation;
      });
    }

  } catch(e) {
    if ( e.appClass === 'Keto:getAcl' ) {
      logger.error(e.appMessage);
      logger.error(JSON.stringify(e));
    } else {
      logger.error('Unexpected error');
      logger.error(JSON.stringify(e));
    }
  }

  // Run next middleware
  next();
}

module.exports = authorization;
