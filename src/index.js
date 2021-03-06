const path = require('path');
const chalk = require('chalk');

const { config } = require('./shared');

function VTEXY(charger) {
  VTEXY.prototype.charge = async function() {
    const opts = await charger();

    if (opts === null || Object.keys(opts).length === 0) {
      console.error(i18n.__('errors.config_not_found'));
      process.exit(0);
    }

    global.VTEXY = {
      account: opts.account,
      baseDirPath: opts.baseDir,
      locale: config.get('locale'),
      dataPath: path.join(opts.baseDir, 'data'),
      contentPath: path.join(opts.baseDir, 'dist'),
      noSSR: opts.noSSR,
      configPath: opts.configPath,
      runtime: {
        data: null,
        content: null
      }
    };
  };

  // console.log(global.VTEXY);

  return VTEXY.prototype;
}

VTEXY.prototype.start = async function() {
  // Use .charge() before invoke .start()
  await require('./server')();
};

VTEXY.prototype.init = async function() {
  await require('./generators').init();
};

module.exports = VTEXY;
