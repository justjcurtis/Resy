export class PromptOptions {
	constructor(title: string, label: string, value: string, ok: string) {
		this.title = title;
		this.label = label;
		this.value = value;
		this.ok = ok;
	}
	title: string;
	label: string;
	value: string;
	ok: string;
}
