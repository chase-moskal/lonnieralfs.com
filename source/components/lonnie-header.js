
import {LitElement, html, css} from "lit-element"

const _createNavLink = Symbol("_createNavLink")

export class LonnieHeader extends LitElement {

	static get properties() {
		return {
			marked: {type: String, reflect: true}
		}
	}

	constructor() {
		super()
		this.marked = ""
	}

	createRenderRoot() {
		return this
	}

	[_createNavLink]({name, href}) {
		const marked = name.toLowerCase() === this.marked.toLowerCase()
		return html`<a href=${href} ?data-marked=${marked}>${name}</a>`
	}

	static get styles() {
		return css`
			* {
				margin: 0;
				padding: 0;
				box-sizing: border-box;
			}
		`
	}

	render() {
		return html`
			<header class="header plate">
				<div>
					<h1>Lonnie Ralfs</h1>
					<nav>
						${this[_createNavLink]({name: "Portfolio", href: "/"})}
							·
						${this[_createNavLink]({name: "Blog", href: "/source/blog/blog-index"})}
					</nav>
				</div>
				<div></div>
			</header>
		`
	}
}
