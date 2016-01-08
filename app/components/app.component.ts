import {Component} from 'angular2/core';
import {InputComponent} from './input.component';

@Component({
	selector: 'main-app',
	template: `<h1>Hi!</h1>
	<input-component></input-component>
	<input-component></input-component>
	<input-component></input-component>
	`,
	directives: [InputComponent]
})
export class AppComponent {

}