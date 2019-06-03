
const fs = require("fs").promises
const {mkdirp: mkdirpAsync} = require("./mkdirp-async")
const {readPosts, makeBlogIndex, makeBlogPost} = require("./blog-toolbox")
const MarkdownIt = require("markdown-it")

main({
	distDir: "blog",
	sourceDir: "source/blog"
})

async function main({
	distDir,
	sourceDir,
	mkdirp = mkdirpAsync,
	writeFile = fs.writeFile,
	md = new MarkdownIt({html: true, linkify: true}),
	makePostPath = (distDir, post) => `${distDir}/${post.date}/${post.urlTitle}/`
}) {
	const posts = await readPosts(`${sourceDir}/posts`)
	const blogPostTemplate = await fs.readFile(`${sourceDir}/blog-post.html`, "utf8")
	const blogIndexTemplate = await fs.readFile(`${sourceDir}/blog-index.html`, "utf8")

	// write blog index
	const indexHtml = await makeBlogIndex({blogIndexTemplate, posts, distDir, makePostPath})
	await mkdirp(distDir)
	await writeFile(`${distDir}/index.html`, indexHtml)

	// write blog posts
	await Promise.all(
		posts.map(async post => {
			const postHtml = await makeBlogPost({blogPostTemplate, post, md})
			const dir = makePostPath(distDir, post)
			await mkdirp(dir)
			await writeFile(`${dir}/index.html`, postHtml)
		})
	)
}
