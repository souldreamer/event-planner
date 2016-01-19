export class UserBiography {
	// see what to add here
}

export class User {
	constructor(
		public name: string,
		public email: string,
		public biography: UserBiography
	) {}
}

export class UsersService {
	public users: User[];
}