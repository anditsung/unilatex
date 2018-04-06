// Copyright (c) 2018, unilatex and contributors
// For license information, please see license.txt

frappe.ui.form.on('Jenis Barang', {
	refresh: function(frm) {

	},
	nama: function(frm) {
		var nama = frm.doc.nama.trim().toUpperCase()
		frm.set_value("nama", nama)
	}
});
