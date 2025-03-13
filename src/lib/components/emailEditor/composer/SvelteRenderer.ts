// SvelteRenderer.js
import { tick } from 'svelte';

export class SvelteRenderer {
	constructor(Component, props) {
		this.Component = Component;
		this.props = props;
		this.element = document.createElement('div');
		this.instance = null;
	}

	mount(element) {
		if (element) {
			this.element = element;
		}

		this.instance = new this.Component({
			target: this.element,
			props: this.props
		});

		return this;
	}

	updateProps(props) {
		if (!this.instance) return;

		for (const key in props) {
			this.instance.$set({ [key]: props[key] });
		}
	}

	destroy() {
		if (this.instance) {
			this.instance.$destroy();
			this.instance = null;
		}
	}
}
