import {Component} from 'angular2/core';

@Component({
	selector: 'register-component',
	template: `
	<h1>Register</h1>
	<form>
		<label for="name"><span>Full name</span><input type="text" id="name" autofocus></label>
		<label for="email"><span>Email address</span><input type="email" id="email"></label>
		<label for="password"><span>Passphrase or password</span><input type="password" id="password"></label>
		<label for="password2"><span>Repeat your passphrase or password</span><input type="password" id="password2"></label>
		<label>Add the optional fields here</label>
	</form>
	`
})
export class RegisterComponent {
}