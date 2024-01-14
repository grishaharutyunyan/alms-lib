const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	authors: [String],
	isbn: {
		type: String,
		required: true
	},
	published_year: {
		type: Number,
		required: true
	},
	category: [String],
	availability: {
		type: Boolean,
		default: true
	},
	location: {
		shelf: String,
		row: Number
	},
	additional_info: {
		publisher: String,
		language: String,
		page_count: Number
	},
	cover_url: String,
	online_version_url: String

});


module.exports = mongoose.model('Book', BookSchema);