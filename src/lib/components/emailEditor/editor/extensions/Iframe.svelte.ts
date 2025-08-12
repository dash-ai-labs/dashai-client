import { Node } from '@tiptap/core';

export interface IframeOptions {
	allowFullscreen: boolean;
	HTMLAttributes: {
		[key: string]: any;
	};
}

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		iframe: {
			/**
			 * Add an iframe
			 */
			setIframe: (attributes: Record<string, any>) => ReturnType;
		};
	}
}

export default Node.create<IframeOptions>({
	name: 'iframe',

	group: 'block',

	atom: true,

	addOptions() {
		return {
			allowFullscreen: true,
			HTMLAttributes: {
				class: 'iframe-wrapper'
			}
		};
	},

	addAttributes() {
		return {
			src: {
				default: null
			},
			srcdoc: {
				default: null
			},
			frameborder: {
				default: 0
			},
			allowfullscreen: {
				default: this.options.allowFullscreen,
				parseHTML: () => this.options.allowFullscreen
			},
			sandbox: {
				default: 'allow-same-origin'
			},
			referrerpolicy: {
				default: 'no-referrer'
			},
			allow: {
				default: ''
			},
			style: {
				default: ''
			}
		};
	},

	parseHTML() {
		return [
			{
				tag: 'iframe'
			}
		];
	},

	renderHTML({ HTMLAttributes }) {
		return ['div', this.options.HTMLAttributes, ['iframe', HTMLAttributes]];
	},

	addCommands() {
		return {
			setIframe:
				(attributes: Record<string, any>) =>
				({ tr, dispatch }) => {
					const { selection } = tr;
					const node = this.type.create(attributes);

					if (dispatch) {
						tr.replaceRangeWith(selection.from, selection.to, node);
					}

					return true;
				}
		};
	}
});
