
import {LitElement, html, css} from "lit-element"

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

	_createNavLink({name, href, external}) {
		const target = external ? "_blank" : "_self"
		const marked = name.toLowerCase() === this.marked.toLowerCase()
		return html`<a target=${target} href=${href} ?data-marked=${marked}>${name}</a>`
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
			<header>
				<h1>Lonnie Ralfs</h1>
				<nav>
					${this._createNavLink({
						name: "Portfolio",
						href: "/"
					})}
					<!--
						·
					${this._createNavLink({
						name: "Catalog",
						href: "/catalog"
					})}
					-->
						·
					${this._createNavLink({
						external: true,
						name: "🔗 Twitch",
						href: "https://twitch.tv/lonnieralfs",
					})}
				</nav>
			</header>
		`
	}
}
