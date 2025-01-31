import aspectRatio from '@tailwindcss/aspect-ratio';
import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import { skeleton } from '@skeletonlabs/tw-plugin';
import { join } from 'path';
export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {
			keyframes: {
				zoom: {
					from: { transform: 'scale(0.95)' },
					to: { transform: 'scale(1)' }
				},
				fade: {
					from: { opacity: '0' },
					to: { opacity: '1' }
				}
			},
			animation: {
				zoom: 'zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
				fade: 'fade 0.2s ease-out'
			},
			colors: {
				primary: {
					red: '#ff453a',
					orange: '#ff9f0a',
					yellow: '#ffd60a',
					green: '#32d74b',
					'light-blue': '#64d2ff',
					blue: '#0a84ff',
					purple: '#5e5ce6',
					violet: '#bf5af2',
					pink: '#ff375f',
					'hazy-black': '#212121',
					black: '#141414',
					container: '#282A2F',
					'dark-container': '#1a1a1a',
					button: '#AAC7FF',
					'active-button-highlight': '#ecf2f8',
					'inactive-button-highlight': '#c6cdd5',
					brighter: 'hsl(204, 70%, 63%)',
					gray: '#89929B',
					'dark-gray': '#3D4249',
					white: '#f0f0f0'
				},
				font: {
					'dark-gray': '#89929b',
					gray: '#c6cdd5',
					'light-gray': '#ecf2f8'
				},
				secondary: {
					red: '#fa7970',
					orange: '#faa356',
					green: '#7ce38b',
					'light-blue': '#a2d2fb',
					blue: '#77bdfb',
					violet: '#cea5fb',
					container: '#191C20',
					'active-button-highlight': '#DAE2F9',
					'active-button-background': {
						DEFAULT: '#3E4759',
						hover: 'hsl(219, 19%, 44%)'
					},
					'inactive-button-highlight': '#C4C6D0',
					separator: '#4D4D4D'
				}
			},
			fontFamily: {
				inter: ['Inter', 'sans-serif']
			},
			fontSize: {
				h1: '36px',
				h2: '30px',
				h3: '24px',
				h4: '20px',
				'section-header': '16px',
				body: '14px',
				subheader: '12px'
			}
		}
	},

	plugins: [typography, forms, containerQueries, aspectRatio, skeleton]
} satisfies Config;
