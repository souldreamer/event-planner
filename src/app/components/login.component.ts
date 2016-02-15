import {Component} from 'angular2/core';

@Component({
	selector: 'login-component',
	template: `
		<h1>Login</h1>
		<label for="email"><span>Email address</span><input type="email" id="email" autofocus></label>
		<label for="password"><span>Passphrase or password</span><input type="password" id="password"></label>
	`
})
export class LoginComponent {

}