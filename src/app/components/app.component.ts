import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {HomeComponent} from './home.component';
import {RegisterComponent} from './register.component';

@Component({
	selector: 'main-app',
	template: `
	<nav>
		<h1>Event planner</h1>
		<a [routerLink]="['/Home']">Home</a> |
		<a [routerLink]="['/Register']">Register</a>
	</nav>
	<router-outlet></router-outlet>
	`,
	directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
	{path: '/', name: 'Root', redirectTo: ['/Home']},
	{path: '/home', name: 'Home', component: HomeComponent},
	{path: '/register', name: 'Register', component: RegisterComponent}
])
export class AppComponent {
}