export interface User {
	id: number;
	email: string;
	name: string;
	profile_pic: string;
	last_login: Date;
	email_accounts: EmailAccount[];
}
export enum LabelType {
	Email = 'EMAIL'
}
export enum LabelColor {
	GREEN = '#7CE38B',
	BLUE = '#77BDFB',
	PURPLE = '#CEA5FB',
	ORANGE = '#FAA356',
	PINK = '#FBB1AC',
	LIGHT_BLUE = '#A2D2FB'
}

export interface InputLabel {
	name: string;
	label_type: LabelType;
	color: LabelColor;
}
export interface Label {
	id: string;
	name: string;
	color: LabelColor;
}
export enum EmailLabelAction {
	Add = 'add',
	Remove = 'remove'
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
	email_labels: Label[];
	date: Date;
	processed: boolean;
}
export interface EmailAccount {
	email: string;
	profile_pic: string;
}
export interface EmailData {
	from_addr: string;
	to: string[];
	cc: string[];
	bcc: string[];
	subject: string;
	body: string;
	attachments: string[];
}

export enum ComposeEmailMode {
	NewEmail = 'New Email',
	Reply = 'Reply',
	Forward = 'Forward'
}
