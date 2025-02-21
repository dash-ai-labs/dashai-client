import { apiRequest } from './base';
import type { InputLabel, Label, LabelType } from './types';

export const getLabelList = async ({
	user,
	type
}: {
	user: string;
	type: LabelType;
}): Promise<Label[]> => {
	try {
		const response = await apiRequest(`user/${user}/labels?label_type=${type}`, {
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
		const response = await apiRequest(`user/${user}/label`, {
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

export const deleteLabel = async ({
	user,
	label
}: {
	user: string;
	label: string;
}): Promise<Label | null> => {
	try {
		const response = await apiRequest(`user/${user}/label/${label}`, {
			method: 'DELETE',
			credentials: 'include'
		});
		return response.json();
	} catch (error) {
		console.error('Error deleting label:', error);
		return null;
	}
};

export const editLabel = async ({
	user,
	label,
	name,
	color
}: {
	user: string;
	label: string;
	name: string;
	color: string;
}): Promise<Label | null> => {
	try {
		const response = await apiRequest(`user/${user}/label/${label}`, {
			method: 'PATCH',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name, color })
		});
		return response.json();
	} catch (error) {
		console.error('Error editing label:', error);
		return null;
	}
};
