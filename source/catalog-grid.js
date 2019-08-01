
const sleep = async(time) => new Promise(
	resolve => setTimeout(() => requestAnimationFrame(resolve), time)
)

export class CatalogGrid {

	constructor({catalogElement, animTime}) {
		this._lastLabel = ""
		this._inProgress = false
		this._animTime = animTime
		this._animInProgress = false
		this._catalogElement = catalogElement

		// install click-to-close functionality
		const links = Array.from(catalogElement.querySelectorAll("a"))
		for (const link of links) link.onclick = event => {
			if (link.getAttribute("data-active")) {
				history.pushState(null, null, "#")
				this._handleChange()
				event.preventDefault()
				return false
			}
		}

		// initialize animation properties
		for (const div of this.labeledDivs) {
			div.hidden = true
			div.setAttribute("data-visible", "false")
		}

		// initial update
		this._handleChange()

		// also update whenever fragment identifier changes
		window.addEventListener("hashchange", () => this._handleChange())
	}

	get label() {
		const {hash: rawHash} = location
		return rawHash[0] === "#" ? rawHash.slice(1) : rawHash
	}

	get links() {
		return Array.from(this._catalogElement.querySelectorAll("a"))
	}

	get labeledDivs() {
		return Array.from(this._catalogElement.querySelectorAll("[data-label]"))
	}

	_handleChange() {
		const {label} = this
		if (label !== this._lastLabel) {
			this._lastLabel = label
			this._sweetAnimLoop(label)
		}
	}

	async _sweetAnimLoop(label) {
		const animTime = this._animTime

		// update [data-active] on all links
		for (const link of this.links) {
			const [,linkLabel] = /#(.*)$/i.exec(link.href) || [null, null]
			if (linkLabel === label) link.setAttribute("data-active", "data-active")
			else link.removeAttribute("data-active")
		}

		// perform animations and set [hidden] on divs
		if (!this._animInProgress) {
			this._animInProgress = true
			const operations = []

			for (const div of this.labeledDivs) {
				const dataLabel = div.getAttribute("data-label")
				const matching = dataLabel === label
				const previousHidden = div.hidden
				const nowHidden = !matching

				// animation to hide
				if (!previousHidden && nowHidden) {
					div.hidden = false
					operations.push(
						sleep(0)
							.then(() => div.setAttribute("animate-visible", "false"))
					)
					operations.push(
						sleep(animTime)
							.then(() => div.hidden = true)
					)
				}

				// animation to make visible
				else if (previousHidden && !nowHidden) {
					div.hidden = false
					operations.push(
						sleep(0)
							.then(() => div.setAttribute("animate-visible", "true"))
							.then(() => sleep(animTime))
					)
				}
			}

			await Promise.all(operations)
			this._animInProgress = false

			const newLabel = this.label
			if (newLabel !== label) {
				return this._sweetAnimLoop(newLabel)
			}
		}
	}
}
