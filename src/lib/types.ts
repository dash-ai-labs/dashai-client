export interface User {
	id: number;
	email: string;
	name: string;
}
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
export interface Email {
	id: string;
	subject: string;
	snippet: string;
	sender: string[];
	sender_name: string[];
	thread_id: string;
	to: string[];
	raw_content: string;
	created_at: Date;
	content: string;
	summary: string;
	email_id: string;
	labels: string[];
	date: Date;
	processed: boolean;
}
export interface EmailAccount {
	email: string;
	profile_pic: string;
}
