
const sleep = async(time) => new Promise(resolve => setTimeout(resolve, time))

export class CatalogGrid {
	_animTime = null
	_reupdateCue = false
	_catalogElement = null

	constructor({catalogElement, animTime}) {
		this._lastLabel = ""
		this._inProgress = false
		this._animTime = animTime
		this._catalogElement = catalogElement

		// initial update
		this._handleChange()

		// also update whenever fragment identifier changes
		window.addEventListener("hashchange", () => this._handleChange())

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
	}

	get label() {
		const {hash: rawHash} = location
		return rawHash[0] === "#" ? rawHash.slice(1) : rawHash
	}

	_handleChange() {
		const {label} = this
		if (label !== this._lastLabel) {
			this._lastLabel = label
			this._sweetAnimLoop(label)
		}
	}

	_animInProgress = false

	async _sweetAnimLoop(label) {
		const {
			_animTime: animTime,
			_catalogElement: catalogElement
		} = this

		// update [data-active] on all links
		const links = Array.from(catalogElement.querySelectorAll("a"))
		for (const link of links) {
			const [,linkLabel] = /#(.*)$/i.exec(link.href) || [null, null]
			if (linkLabel === label) link.setAttribute("data-active", "data-active")
			else link.removeAttribute("data-active")
		}

		if (!this._animInProgress) {
			this._animInProgress = true

			// keep all animation promises so we know when they're all done
			const operations = []

			// perform animations and set [hidden] on divs
			const labeledDivs = Array.from(catalogElement.querySelectorAll("[data-label]"))
			for (const div of labeledDivs) {
				const dataLabel = div.getAttribute("data-label")
				const matching = dataLabel === label
				const previousHidden = div.hidden
				const nowHidden = !matching

				// animation to hide
				if (!previousHidden && nowHidden) {
					div.hidden = false
					operations.push(
						sleep(0).then(() => {
							div.setAttribute("animate-visible", "false")
						})
					)
					operations.push(
						sleep(animTime).then(() => {
							div.hidden = true
						})
					)
				}

				// animation to make visible
				else if (previousHidden && !nowHidden) {
					div.hidden = false
					operations.push(
						sleep(0).then(() => {
							div.setAttribute("animate-visible", "true")
						})
					)
					operations.push(
						sleep(animTime)
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
