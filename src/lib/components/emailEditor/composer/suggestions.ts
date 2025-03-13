import tippy, { type Instance } from 'tippy.js';

import { SvelteRenderer } from './SvelteRenderer';
import type { Editor, Range } from '@tiptap/core';
import type { Component } from 'svelte';
import CommandsList from './CommandList.svelte';
type CommandListConstructor = new (options: { target: HTMLElement; props: any }) => Component;

export default {
	items: ({ query }: { query: string }) => {
		return [
			{
				title: 'Heading 1',
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
				}
			},
			{
				title: 'Heading 2',
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
				}
			},
			{
				title: 'Bold',
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor.chain().focus().deleteRange(range).setMark('bold').run();
				}
			},
			{
				title: 'Italic',
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor.chain().focus().deleteRange(range).setMark('italic').run();
				}
			}
		]
			.filter((item) => item.title.toLowerCase().startsWith(query.toLowerCase()))
			.slice(0, 10);
	},

	render: () => {
		let component: any;
		let popup: Instance[];

		return {
			onStart: (props: any) => {
				const el = document.createElement('div');

				component = new SvelteRenderer(CommandsList, {
					props,
					editor: props.editor
				});

				if (!props.clientRect) {
					return;
				}

				popup = tippy('body', {
					getReferenceClientRect: props.clientRect,
					appendTo: () => document.body,
					content: el,
					showOnCreate: true,
					interactive: true,
					trigger: 'manual',
					placement: 'bottom-start'
				});
			},

			onUpdate: (props: { editor: Editor; clientRect: DOMRect }) => {
				component?.$set(props);

				popup &&
					popup[0].setProps({
						getReferenceClientRect: props.clientRect
					});
			},
			onKeyDown: (props: { event: KeyboardEvent }) => {
				if (props.event.key === 'Escape') {
					popup?.[0].hide();

					return true;
				}

				// return component?.ref?.onKeyDown(props);
			},

			onExit() {
				popup[0].destroy();
				component.destroy();
			}
		};
	}
};
