// Copyright (c) 2018, unilatex and contributors
// For license information, please see license.txt

frappe.ui.form.on('Sparepart Gudang', {
	refresh: function(frm) {

	},
	nama_gudang: function(frm) {
		if(frm.doc.nama_gudang) {
			var nama_gudang = frm.doc.nama_gudang.trim().toUpperCase()
			frm.set_value("nama_gudang", nama_gudang)
			frm.set_value("gudang_abbr", nama_gudang_abbr(nama_gudang))
			frm.events.generate_kode_gudang(frm)
		}
		else {
			frm.set_value("gudang_abbr", "")
		}
	},
	site: function(frm) {
		if(frm.doc.site) {
			frm.events.generate_kode_gudang(frm)
		}
		else {
			frm.set_value("site_abbr", "")
		}
	},
	generate_kode_gudang: function(frm) {
		var gudang = frm.doc.gudang_abbr
		var site = frm.doc.site_abbr
		if(gudang && site) {
			frm.set_value("kode_gudang", gudang + "-" + site)
			frm.refresh()
		}
	}
});
/*
tidak perlu ini lagi
cukup setting di user permissions

cur_frm.fields_dict.site.get_query = function(frm) {
	return {
		filters: [
			['Site', 'site_name', '!=', 'ALL']
		]
	}
}*/

function nama_gudang_abbr(nama_gudang) {
	var matches = nama_gudang.match(/\b(\w)/g)
	var abbr = matches.join('')
	return abbr
}
