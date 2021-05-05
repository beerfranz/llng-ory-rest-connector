const axios = require('axios');

const logManager = require('./logger.js');

/**
 * Communication with Keto, the authorization provider.
 * Attributes:
 *  - keto: URL to keto REST API. ex: http://keto:4466
 **/
class Keto {

  constructor(keto_url) {
    this.keto = keto_url;
  }

  /**
   * Get ACL from Keto for a subject (user ID).
   * @return Promise
   * @throw Exception with appClass='Keto:getAcl' & appMessage=string
   **/
  getAcl(subject) {
    let logger = logManager.createLogger('Keto:getRights');
    let keto = this.keto;

    return axios.get(this.keto + '/relation-tuples', { params: { namespace: 'manager', subject: subject } }).catch(function(e) {
      e.appMessage = 'Failed access to Keto ' + keto + '/relation-tuples for subject ' + subject;
      e.appClass = 'Keto:getAcl';
      throw e;
    });
  }
}

module.exports = Keto;
