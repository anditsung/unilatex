// Copyright (c) 2018, unilatex and contributors
// For license information, please see license.txt

frappe.ui.form.on('Gudang', {
	refresh: function(frm) {
		frm.set_query("perusahaan", function() {
			return {
				"filters": [
					["Perusahaan", "nama", "!=", "ALL"]
				]
			}
		})
	},
	nama: function(frm) {
		if(frm.doc.nama) {
			var nama = frm.doc.nama.trim().toUpperCase()
			frm.set_value("nama", nama)
			frm.set_value("kode_nama", singkatan_nama(nama))
			frm.events.generate_kode_gudang(frm)
		}
		else {
			frm.set_value("kode_nama", "")
			frm.events.generate_kode_gudang(frm)
		}
	},
	perusahaan: function(frm) {
		if(frm.doc.perusahaan) {
			frm.events.generate_kode_gudang(frm)
		}
		else {
			frm.set_value("kode_perusahaan", "")
			frm.events.generate_kode_gudang(frm)
		}
	},
	generate_kode_gudang: function(frm) {
		if(frm.doc.kode_nama && frm.doc.kode_perusahaan) {
			var kode_gudang = frm.doc.kode_nama + "-" + frm.doc.kode_perusahaan
			frm.set_value("kode", kode_gudang)
		}
		else {
			frm.set_value("kode", "")
		}
	}
});

function singkatan_nama(nama) {
	var matches = nama.match(/\b(\w)/g)
	var namas = matches.join('')
	return namas
}