// Copyright (c) 2018, unilatex and contributors
// For license information, please see license.txt

frappe.ui.form.on('Karyawan', {
	refresh: function(frm) {
		cur_frm.set_query("bagian", function() {
			return {
				"filters": {
					"aktif": true
				}
			}
		})
		
		cur_frm.set_query("perusahaan", function() {
			return {
				"filters": {
					"aktif": true
				}
			}	
		})
	},
	onload: function(frm) {
		frm.set_value("id_bak", frm.doc.naming_series)
	},
	nama: function(frm) {
		var nama = frm.doc.nama.trim().toUpperCase()
		frm.set_value("nama", nama)
	},
	tempat_lahir: function(frm) {
		var tempat_lahir = frm.doc.tempat_lahir.trim().toUpperCase()
		frm.set_value("tempat_lahir", tempat_lahir)
	},
	alamat: function(frm) {
		var alamat = frm.doc.alamat.trim().toUpperCase()
		frm.set_value("alamat", alamat)
	},
	perusahaan: function(frm) {
		frm.events.update_series(frm)
	},
	update_series: function(frm) {
		var naming_series = frm.doc.id_bak
		naming_series = naming_series.replace("ZZ", frm.doc.kode_perusahaan)
		frm.set_value("naming_series", naming_series)
	},
	validate: function(frm) {
		// cek no est berdasarkan perusahaan
	}
});
