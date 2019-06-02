
const mkdirpOriginal = require("mkdirp")

const mkdirp = async function(...args) {
	return new Promise((resolve, reject) => {
		mkdirpOriginal(...args, err => {
			if (err) reject(err)
			else resolve()
		})
	})
}

module.exports = {mkdirp}
