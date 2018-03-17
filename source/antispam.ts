
/**
 * Avoid simple bots by requiring javascript to decode and present email addresses.
 * Run through the DOM and inject Base64-encoded email addresses.
 * Seek out [data-email] attributes, assume their contents are base-64 encoded strings, decode them, and insert the result as the element's text content.
 */
export default function antispam(anchorElements: NodeListOf<Element> = document.querySelectorAll("a[data-email]")) {

	const elements: HTMLAnchorElement[] = [].slice.call( document.querySelectorAll("a[data-email]") )

	for (const a of elements) {
		const email = atob(a.getAttribute("data-email"))
		a.href = `mailto:${email}`
		a.textContent = email
	}
}
