import {Component} from 'angular2/core';

@Component({
	selector: 'register-component',
	template: `
	<h1>Register</h1>
	<form>
		<label for="name"><span>Full name</span><input type="text" id="name"></label>
		<label for="email"><span>Email address</span><input type="email" id="email"></label>
		<label for="password"><span>Passphrase or password</span><input type="password" id="password"></label>
	</form>
	`
})
export class RegisterComponent {
}