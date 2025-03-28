import { get } from 'svelte/store';
import { getLabelList } from './api/label';
import { LabelType, ToastType } from './types';
import { emailLabels, user } from './store';
import { type ToastSettings } from '@skeletonlabs/skeleton';

export const refreshEmailLabels = async () => {
	const emailLabelList = await getLabelList({
		user: get(user)?.id.toString(),
		type: LabelType.Email
	});
	emailLabels.set(emailLabelList);
};

export const showToast = (toastStore: any, message: string, type: ToastType) => {
	const t: ToastSettings = {
		message: message,
		background: type
	};
	toastStore.trigger(t);
};
