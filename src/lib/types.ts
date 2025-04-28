export interface User {
	id: number | null;
	email: string | null;
	name: string | null;
	profile: Profile | null;
}

export interface Profile {
	id: number;
	email: string;
	name: string;
	profile_pic: string;
	last_login: Date;
	email_accounts: EmailAccount[];
	notifications: Notification[];
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

export interface SearchEntry {
	query: string;
	resultReader: ReadableStreamDefaultReader | null;
	loading: boolean;
	id: string;
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
	is_read: boolean;
}

export enum EmailAccountStatus {
	NOT_STARTED = 'NOT_STARTED',
	SYNCING = 'SYNCING',
	SUCCESS = 'SUCCESS',
	FAILED = 'FAILED'
}
export enum EmailProvider {
	GMAIL = 'GMAIL'
}

export interface EmailAccount {
	email: string;
	profile_pic: string;
	created_at: Date;
	status: EmailAccountStatus;
	provider: EmailProvider;
}

export enum EmailFolder {
	INBOX = 'inbox',
	TRASH = 'trash',
	SPAM = 'spam',
	DRAFTS = 'drafts',
	SENT = 'sent'
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

export enum ToastType {
	Success = 'bg-primary-green',
	Error = 'bg-primary-red',
	Warning = 'bg-primary-yellow',
	Info = 'bg-primary-blue'
}

export enum TaskStatus {
	PENDING = 'pending',
	COMPLETED = 'completed',
	ARCHIVED = 'archived'
}

export enum TaskAction {
	CREATE = 'create',
	UPDATE = 'update',
	ARCHIVE = 'archive'
}

export interface Task {
	id: string;
	title: string;
	description: string;
	status: TaskStatus;
	due_date: string;
	created_at: string;
	updated_at: string;
	url?: string;
	url_text?: string;
	thumbnail_url?: string;
	email_id: string;
	email_account_id: string;
}

export enum NotificationStatus {
	UNREAD = 'UNREAD',
	READ = 'READ',
	ARCHIVED = 'ARCHIVED'
}

export interface Notification {
	id: string;
	title: string;
	message: string;
	created_at: string;
	status: NotificationStatus;
	link: string;
}

export interface EmailServiceState {
	currentEmail: Email | null;
	emailSearchQueryList: SearchEntry[];
	aiSearchQuery: string;
	emailLabels: Label[];
	showComposeEmail: boolean;
	composeEmailMode: ComposeEmailMode;
	emailAccount: any;
	emailList: Email[];
	emailListFilter: string[];
	taskList: Task[];
	showTaskList: boolean;
}
