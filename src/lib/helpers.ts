import { get } from 'svelte/store';
import { getLabelList } from './api/label';
import { LabelType } from './types';
import { emailLabels, user } from './store';

export const refreshEmailLabels = async () => {
	const emailLabelList = await getLabelList({
		user: get(user)?.id.toString(),
		type: LabelType.Email
	});
	emailLabels.set(emailLabelList);
};
