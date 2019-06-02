
const fs = require("fs").promises
const mustache = require("mustache")
const MarkdownIt = require("markdown-it")
const grayMatter = require("gray-matter")

const blogPostFileNameRegex = /^(\d{4}-\d{2}-\d{2})[-=:](.*)\.md$/i

async function readPosts(postsDir) {
	const posts = await Promise.all(
		(await fs.readdir(postsDir)).map(name => readPost(postsDir, name))
	)
	return posts.filter(post => !!post)
}

async function makeBlogIndex({blogIndexTemplate, posts, distDir}) {
	const blogIndexHtml = `
		<ol class="blog-index">
			${posts.map(post => `
				<li>
					<p><strong>
						<a href="${"/" + distDir + "/" + post.date + "-" + post.name}">
							${post.title}
						</a>
					</strong></p>
					<p>${post.date}</p>
					<p>${post.description}</p>
				</li>
			`).join("")}
		</ol>
	`
	return mustache.render(blogIndexTemplate, {blogIndexHtml})
}

async function makeBlogPost({blogPostTemplate, post, md = new MarkdownIt()}) {
	const blogPostHtml = md.render(post.markdown)
	return mustache.render(blogPostTemplate, {...post, blogPostHtml})
}

async function readPost(postsDir, name) {
	const path = `${postsDir}/${name}`
	const stats = await fs.stat(path)
	const isFile = stats.isFile()
	if (!isFile || !blogPostFileNameRegex.test(name)) return null
	const data = await fs.readFile(path, "utf8")
	const {content: markdown, data: matter} = grayMatter(data)
	const [, date, urlTitle] = blogPostFileNameRegex.exec(name)
	return {...matter, date, urlTitle, markdown}
}

module.exports = {
	readPosts,
	makeBlogIndex,
	makeBlogPost
}
