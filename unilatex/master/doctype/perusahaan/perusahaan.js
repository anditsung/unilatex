// Copyright (c) 2018, unilatex and contributors
// For license information, please see license.txt

frappe.ui.form.on('Perusahaan', {
	refresh: function(frm) {

	},
	nama: function(frm) {
		var nama = frm.doc.nama.trim().toUpperCase()
		frm.set_value("nama", nama)
	},
	alamat: function(frm) {
		var alamat = frm.doc.alamat.trim().toUpperCase()
		frm.set_value("alamat", alamat)
	}
});
