let {namespace, task} = require('jake');

namespace('backend', () => require('./backend/Jakefile'));
namespace('frontend', () => require('./frontend/Jakefile.cjs'));
namespace('deployments', () => require('./deployments/Jakefile'));

task('build', ['backend:build', 'frontend:build']);
task('default', ['build'])
