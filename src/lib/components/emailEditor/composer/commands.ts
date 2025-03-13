import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';

import { Editor, type Range } from '@tiptap/core';
export default Extension.create({
	name: 'slash-commands',

	addOptions() {
		return {
			suggestion: {
				char: '/',
				command: ({ editor, range, props }: { editor: Editor; range: Range; props: any }) => {
					props.command({ editor, range });
				},
				onStart: () => {
					console.log('onStart');
				}
			}
		};
	},

	addProseMirrorPlugins() {
		return [
			Suggestion({
				editor: this.editor,
				...this.options.suggestion
			})
		];
	}
});
