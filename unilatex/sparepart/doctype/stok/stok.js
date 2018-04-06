// Copyright (c) 2018, unilatex and contributors
// For license information, please see license.txt

frappe.ui.form.on('Stok', {
	refresh: function(frm) {

	},
	kode_barang: function(frm) {
		if(!frm.doc.kode_barang) {
			frm.set_value("nama_barang", "")
		}
		frm.events.generate_kode_stok(frm)
	},
	gudang: function(frm) {
		frm.events.generate_kode_stok(frm)
	},
	generate_kode_stok: function(frm) {
		if(frm.doc.kode_barang && frm.doc.gudang) {
			var kode_stok = frm.doc.kode_barang + "-" + frm.doc.gudang
			frm.set_value("kode_stok", kode_stok)
		}
		else {
			frm.set_value("kode_stok", "")
		}
		frm.refresh()
	}
});

cur_frm.add_fetch("gudang", "perusahaan", "perusahaan1")
//cur_frm.add_fetch("perusahaan", "kode", "kode_perusahaan")