// Copyright (c) 2018, unilatex and contributors
// For license information, please see license.txt

frappe.ui.form.on('Mutasi', {
	refresh: function(frm) {

	},
	karyawan: function(frm) {
		frappe.call({
			method: "frappe.client.get",
			args: {
				doctype: "Karyawan",
				name: frm.doc.karyawan,
			},
			callback: function(r) {
				frm.set_value("nama", r.message.nama)
				frm.set_value("est", r.message.est)
				frm.set_value("bagian", r.message.bagian)
				frm.set_value("perusahaan", r.message.perusahaan)
			}
		})
	},
	bagian: function(frm) {
		cur_frm.set_query("bagian_baru", function() {
			return {
				"filters": [
					["Bagian", "nama", "!=", frm.doc.bagian]
				]
			}
		})
	},
	validate: function(frm) {
		var bagian = frm.doc.bagian
		var bagian_baru = frm.doc.bagian_baru
		if(bagian == bagian_baru) {
			frappe.msgprint("Bagian baru tidak boleh sama dengan bagian saat ini")
			frappe.validated = false
			return false
		}
		//frappe.model.set_value("Karyawan", frm.doc.karyawan, "bagian", bagian_baru)
		frappe.call({
			method: "frappe.client.set_value",
			args: {
				doctype: "Karyawan",
				name: frm.doc.karyawan,
				fieldname: {
					"bagian": bagian_baru
				}
			}
		})
	}
});
