const User = require('../models/User')

const is_whitelisted = async (linkblue_username) => {
	const user = await User.query().findById('user')
	if (user){
		return true
	} else{
		return false
	}
}

module.exports.is_whitelisted = is_whitelisted
