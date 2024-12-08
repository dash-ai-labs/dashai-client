import { PUBLIC_API_URL } from '$env/static/public';

export enum LabelType {
	Email = 'EMAIL'
}
export interface InputLabel {
	name: string;
	keywords: string[];
	label_type: LabelType;
}
export interface Label {
	id: string;
	name: string;
	keywords: string[];
}
export const getLabelList = async ({
	user,
	type
}: {
	user: string;
	type: LabelType;
}): Promise<Label[]> => {
	try {
		const response = await fetch(`${PUBLIC_API_URL}/user/${user}/labels?label_type=${type}`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		return response.json();
	} catch (error) {
		console.error('Error fetching labels:', error);
		return [];
	}
};

export const createLabel = async ({
	user,
	label
}: {
	user: string;
	label: InputLabel;
}): Promise<Label | null> => {
	try {
		const response = await fetch(`${PUBLIC_API_URL}/user/${user}/label`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(label)
		});
		return response.json();
	} catch (error) {
		console.error('Error creating label:', error);
		return null;
	}
};
