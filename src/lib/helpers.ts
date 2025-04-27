import { get } from 'svelte/store';
import { getLabelList } from './api/label';
import { LabelType, ToastType } from './types';
import { emailServiceState, user } from './store';
import { type ToastSettings } from '@skeletonlabs/skeleton';

export const refreshEmailLabels = async () => {
	const emailLabelList = await getLabelList({
		user: get(user)?.id.toString(),
		type: LabelType.Email
	});
	await emailServiceState.update((state) => ({
		...state,
		emailLabels: emailLabelList
	}));
};

export const showToast = (toastStore: any, message: string, type: ToastType) => {
	const t: ToastSettings = {
		message: message,
		background: type,
		classes: 'toast-message'
	};
	toastStore.trigger(t);
};
