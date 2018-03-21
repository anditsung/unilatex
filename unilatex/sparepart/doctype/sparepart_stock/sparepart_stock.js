// Copyright (c) 2018, unilatex and contributors
// For license information, please see license.txt

frappe.ui.form.on('Sparepart Stock', {
	refresh: function(frm) {

	},
	gudang_code: function(frm) {
		frappe.model.with_doc("Sparepart Gudang", frm.doc.gudang_code, function() {
			var gudang = frappe.model.get_doc("Sparepart Gudang", frm.doc.gudang_code)
			frm.set_value("site", gudang.site)
			frm.set_value("site_abbr", gudang.site_abbr)
		})
	
		//frappe.db.get_value("Sparepart Gudang", { kode_gudang: frm.doc.gudang_code }, 'site').then(({ message }) => { site = message.site })
		//frappe.db.get_value("Sparepart Gudang", { kode_gudang: frm.doc.gudang_code }, 'site').then(({ message }) => { console.log(message.site) })
		frm.events.generate_stock_code(frm)
	},
	item_code: function(frm) {
		frm.events.generate_stock_code(frm)
	},
	generate_stock_code: function(frm) {
		var item_code = frm.doc.item_code
		var gudang_code = frm.doc.gudang_code
		if(item_code && gudang_code) {
			var stock_code = item_code + "-" + gudang_code
			frm.set_value("stock_code", stock_code)
			frm.refresh()
		}	
	}
});
