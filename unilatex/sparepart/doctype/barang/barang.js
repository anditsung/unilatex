// Copyright (c) 2018, unilatex and contributors
// For license information, please see license.txt

frappe.ui.form.on('Barang', {
	refresh: function(frm) {

	},
	kode: function(frm) {
		var kode = frm.doc.kode.trim().toUpperCase()
		frm.set_value("kode", kode)
	},
	nama: function(frm) {
		var nama = frm.doc.nama.trim().toUpperCase()
		frm.set_value("nama", nama)
	}
});
