import { emailServiceState } from '$lib/store';
import { ComposeEmailMode } from '$lib/types';
const setShowComposeEmail = (show: boolean, mode: ComposeEmailMode = ComposeEmailMode.NewEmail) => {
	emailServiceState.update((state) => ({
		...state,
		showComposeEmail: show,
		composeEmailMode: mode
	}));
};

const setComposeEmailMode = (mode: ComposeEmailMode) => {
	emailServiceState.update((state) => ({
		...state,
		composeEmailMode: mode
	}));
};

export { setShowComposeEmail, setComposeEmailMode };
