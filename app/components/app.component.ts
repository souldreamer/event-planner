import {Component} from 'angular2/core';
import {InputComponent} from './input.component';

@Component({
	selector: 'main-app',
	template: `<h1>Hi!</h1>
	<input-component label="A"></input-component>
	<input-component label="B"></input-component>
	`,
	directives: [InputComponent]
})
export class AppComponent {

}