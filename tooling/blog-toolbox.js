
const fs = require("fs").promises
const mustache = require("mustache")
const grayMatter = require("gray-matter")

const blogPostFileNameRegex = /^(\d{4}-\d{2}-\d{2})[-=:](.*)\.md$/i

const parseDate = date => {
	const [year, month, day] = date.split("-")
	return new Date(year - 1, month, day)
}

async function readPosts(postsDir) {
	const posts = await Promise.all(
		(await fs.readdir(postsDir)).map(name => readPost(postsDir, name))
	)
	return posts
		.filter(post => !!post)
		.sort((postA, postB) => {
			const dateA = parseDate(postA.date)
			const dateB = parseDate(postB.date)
			if (dateA === dateB)
				return 0
			else if (dateA > dateB)
				return -1
			else
				return 1
		})
}

async function makeBlogIndex({blogIndexTemplate, posts, distDir, makePostPath}) {
	const blogIndexHtml = `
		<ol class="blog-index">
			${posts.map(post => `
				<li>
					<p><strong>
						<a href="${makePostPath(distDir, post)}">
							${post.title}
						</a>
					</strong></p>
					<p class="date">${post.date}</p>
					<p>${post.description}</p>
				</li>
			`).join("")}
		</ol>
	`
	return mustache.render(blogIndexTemplate, {blogIndexHtml})
}

async function makeBlogPost({blogPostTemplate, post, md}) {
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
