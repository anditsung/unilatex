// Copyright (c) 2018, unilatex and contributors
// For license information, please see license.txt

frappe.ui.form.on('Work Order', {
	refresh: function(frm) {
		if(!frm.doc.__islocal && frm.doc.selesai) {
			frm.disable_save()
			frm.events.woselesai(frm)
		}
	},
	onload: function(frm) {
		if (frm.doc.__islocal) {
			frm.set_value("id_bak", frm.doc.naming_series)
			frm.enable_save();
		}
		else {
			if(frm.doc.selesai == true) {
				frm.disable_save()
				frm.events.woselesai(frm)
			}
		}
	},
	woselesai: function(frm) {
		frm.set_df_property("selesai", "read_only", true)
		frm.set_df_property("tanggal_selesai", "read_only", true)
		frm.set_df_property("masalah", "read_only", true)
		frm.set_df_property("solusi", "read_only", true)
	},
	kode_perusahaan: function(frm) {
		var naming_series = frm.doc.id_bak
		naming_series = naming_series.replace("ZZ", frm.doc.kode_perusahaan)
		frm.set_value("naming_series", naming_series)
	}
});
