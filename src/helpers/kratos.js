const axios = require('axios');

const logManager = require('./logger.js');

class Kratos {

  constructor(kratos_url, kratos_admin_url) {
    this.kratos = kratos_url;
    this.kratos_admin = kratos_admin_url;
  }

  /**
   * Init a login flow with Kratos
   * @return Promise
   * @throw Exception with appClass='Kratos:initLoginFlow' & appMessage=string
   **/
  initLoginFlow() {
    let logger = logManager.createLogger('Kratos:initLoginFlow');

    let kratos = this.kratos;

    logger.debug('Init login flow with Kratos on ', kratos, '/self-service/login/api');
    return axios.get(kratos + '/self-service/login/api', { headers: { 'Accept': 'application/json'} } ).catch(e => {
      e.appMessage = 'Failed access to Kratos ' + kratos + '/self-service/login/api';
      e.appClass = 'Kratos:initLoginFlow';
      throw e;
    });
  }

  /**
   * Execute a login flow with Kratos
   * @return Promise
   * @throw Exception with appClass='Kratos:loginApiFlow' & appMessage=string
   **/
  async loginApiFlow(req, res) {

    let logger = logManager.createLogger('Kratos:loginApiFlow');

    let response = await this.initLoginFlow();

    logger.debug('Init login flow successfully for user ', req.body.user);
    logger.debug('Send login and password to ', response.data.methods.password.config.action);
    return axios.post(response.data.methods.password.config.action,
      {
        'identifier': req.body.user,
        'password': req.body.password
      },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    ).catch( e => {
      e.appMessage = 'Login failed for user ' + req.body.user;
      e.appClass = 'Kratos:loginApiFlow';
      throw e;
    })

  }
}

module.exports = Kratos;
