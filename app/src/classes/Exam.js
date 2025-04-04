//  title: {type: String},
// 	start_at: { type: Date, required: true },
// 	duration: { type: Number, required: true },
// 	authorized_groups: [{ type: String, required: true }],
// 	nb_slots: { type: Number, required: true },
// 	watchers: {type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }], default: []},
// 	is_archived: {type: Boolean, default: false}

import config from "config";
import Watcher from "./Watcher";

export default class Exam {

	constructor(exam, updateFunction, deleteFunction) {
		this._id = exam._id;
		this.title = exam.title;
		this.start_at = new Date(exam.start_at);
		this.duration = exam.duration;
		this.authorized_groups = exam.authorized_groups;
		this.nb_slots = exam.nb_slots;
		this.is_archived = exam.is_archived;
		this.end_at = new Date(new Date(exam.start_at).setHours(new Date(exam.start_at).getHours() + exam.duration));
		this.setWatchers(exam.watchers);

		this.updateFunction = updateFunction;
		this.deleteFunction = deleteFunction;
	}

	setWatchers(watchers) {
		this.watchers = watchers.map(w => new Watcher(w, null, null, this));
	}

	async register() {
		const response = await fetch(`${config.apiUrl}/exams/${this._id}/register`, {
			method: 'POST',
			credentials: 'include',
		});
		if (response.ok) {
			this.setWatchers(await response.json());
			if (this.updateFunction) this.updateFunction(this);
		}
		return response;
	}

	async unregister() {
		const response = await fetch(`${config.apiUrl}/exams/${this._id}/unregister`, {
			method: 'POST',
			credentials: 'include',
		});
		if (response.ok) {
			this.setWatchers(await response.json());
			if (this.updateFunction) this.updateFunction(this);
		}
		return response;
	}

	async archive() {
		const response = await fetch(`${config.apiUrl}/exams/${this._id}/archive?log_sheet=true`, {
			method: 'POST',
			credentials: 'include',
		});
		if (response.ok) {
			this.is_archived = true;
			if (this.updateFunction) this.updateFunction(this);
		}
		return response;
	}

	async delete() {
		const response = await fetch(`${config.apiUrl}/exams/${this._id}`, {
			method: 'DELETE',
			credentials: 'include',
		});
		if (response.ok) {
			if (this.deleteFunction) this.deleteFunction(this._id);
		}
		return response;
	}

	async addWatcher(login) {
		const response = await fetch(`${config.apiUrl}/exams/${this._id}/watchers`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({login}),
		});
		if (response.ok) {
			this.setWatchers(await response.json());
			if (this.updateFunction) this.updateFunction(this);
		}
		return response;
	};

}