const bcrypt = require('bcrypt');
const saltRounds = 12;

process.argv.forEach((val, index, array) => {
	if (index === 2) {
		bcrypt.hash(val, saltRounds, async (err, hash) => {
			console.log(hash);
		});
	}
});
