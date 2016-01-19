import {User} from './users.service';

export class EventType {
	constructor(
		public type: string,
		public image: string
	) {}
}

export class Event {
	constructor(
		public name: string,
		public type: EventType,
		public host: User,
		public startDatetime: Date,
		public endDatetime: Date,
		public guestList: User[],
		public location: Geolocation,
		public description: string = ''
	) {}
}

export class EventsService {
	public events: Event[];
}