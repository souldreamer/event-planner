import {Component} from 'angular2/core';

@Component({
	selector: 'input-component',
	template: `
		<label [attr.for]="inputName">{{label}}
		<input #input [attr.id]="inputName" type="text"></label>
	`,
	styles: [
		`label { color: red; }`
	]
})
export class InputComponent {
	public static latestId: number = 0;
	private inputId: number = InputComponent.latestId;

	constructor() {
		InputComponent.latestId++;
	}
	get inputName(): string {
		return 'input-' + this.inputId;
	}
	get label(): string {
		return ['email', 'username', 'passphrase'][this.inputId];
	}
}