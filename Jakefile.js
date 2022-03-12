let {namespace, task} = require('jake');

namespace('prelude', () => require('prelude/Jakefile'));
namespace('backend', () => require('backend/Jakefile'));
namespace('frontend', () => require('frontend/Jakefile'));

task('build', ['prelude:build', 'backend:build', 'frontend:build']);
task('default', ['build'])
