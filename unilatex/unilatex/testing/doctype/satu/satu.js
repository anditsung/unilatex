// Copyright (c) 2018, unilatex and contributors
// For license information, please see license.txt

frappe.ui.form.on('satu', {
	refresh: function(frm) {

	},
	test: function(frm) {
		var username = frappe.user.name
		//console.log(username)
		frappe.model.with_doc("Karyawan", { 'user': username}, function() {
			var karyawan = frappe.model.get_doc("Karyawn", { 'user': username})
			//console.log(karyawan)
		})

		frappe.model.with_doc("Karyawan", function() {
			var doc = frappe.model.get_doc("Karyawan")
			console.log(doc)
		})

		frappe.model.with_doc("User", username, function() {
			var user = frappe.model.get_doc("User", username)
			//console.log(user)
		})
	}
});
