
const fs = require("fs").promises
const mustache = require("mustache")

async function main() {
	const posts = await getPosts()
	for (const post of posts) {

	}
}

async function getPosts() {
	return (await Promise.all(
		(await fs.readdir("source/blog"))
			.map(async date => {
				const stats = await fs.stat(`source/blog/${date}`)
				const isDirectory = stats.isDirectory()
				return {date, isDirectory}
			})
	))
		.filter(({date, isDirectory}) => isDirectory && /^\d{4}-.*$/i.test(date))
		.map(({date}) => ({date}))
}

main()
