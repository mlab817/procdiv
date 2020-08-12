const Dotenv = require('dotenv')
const parsedEnv = Dotenv.config().parsed

module.exports = function() {
	for (key in parsedEnv) {
		if (typeof parsedEnv[key] === 'string') {
			parsedEnv[key] = JSON.stringify(parsedEnv[key])
		}
	}
	return parsedEnv
}