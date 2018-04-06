// Copyright (c) 2018, unilatex and contributors
// For license information, please see license.txt

frappe.ui.form.on('Transfer', {
	refresh: function(frm) {

	},
	onload: function(frm) {
		if (frm.doc.__islocal) {
			frm.set_value("id_bak", frm.doc.naming_series)
			frm.enable_save();
		}
		else {
			frm.disable_save()
		}
	},
	perusahaan: function(frm) {
		cur_frm.set_query("karyawan", function() {
			return {
				"filters": {
					"perusahaan": frm.doc.perusahaan
				}
			}
		})
	},
	kode_perusahaan: function(frm) {
		var naming_series = frm.doc.id_bak
		naming_series = naming_series.replace("ZZ", frm.doc.kode_perusahaan)
		frm.set_value("naming_series", naming_series)
	},
	validate: function(frm) {
		var save = true
		var breakException = {}
		
		try {
			frm.doc.transfer_table.forEach(function(barang) {
				if(barang.jumlah <= 0) {
					var msg = "Jumlah barang yang akan ditransfer harus lebih besar dari 0. ( " + barang.nama_barang + " [ " + barang.barang + " ], index = " + barang.idx + " )"
					frappe.msgprint(msg)
					frappe.validated = false
					save = false
					throw breakException
				}
				
				if(barang.jumlah > barang.stok) {
					var msg = "Jumlah barang yang akan ditransfer lebih banyak dari jumlah stok yang ada. ( " + barang.nama_barang + " [ " + barang.barang + " ], index = " + barang.idx + " )"
					frappe.msgprint(msg)
					frappe.validated = false
					save = false
					throw breakException
				}
				
				if(barang.kode_gudang == barang.gudang_tujuan) {
					var msg = "Tujuan gudang tidak boleh sama dengan lokasi gudang awal. ( " + barang.nama_barang + " [ " + barang.barang + " ], index = " + barang.idx + " )"
					frappe.msgprint(msg)
					frappe.validated = false
					save = false
					throw breakException
				}
				
			})
		} catch(e) {
			if( e !== breakException ) throw e
		}
		
		if(save) {
			frappe.call({
				method: "transfer",
				doc: frm.doc,
				callback: function(r) {
					if(r.message.pesan) {
						frappe.msgprint(r.message.pesan)
						frm.disable_save()
					}
				}
			});
		}
	}
});

cur_frm.fields_dict['transfer_table'].grid.get_field('stok_gudang').get_query = function(frm, cdt, cdn) {
	var bar = locals[cdt][cdn]
	return {
		"filters": [
			["Stok", "kode_barang", "=", bar.barang ], // filter stok barang di gudang berdasarkan kode barang
			["Stok", "perusahaan", "=", frm.perusahaan], // filter stok barang di gudang berdasarkan lokasi stok
			["Stok", "jumlah", ">", 0] // filter stok barang di gudang yang stoknya diatas 0
		]
	}
}

cur_frm.fields_dict['transfer_table'].grid.get_field('gudang_tujuan').get_query = function(frm, cdt, cdn) {
	var bar = locals[cdt][cdn]
	return {
		filters: [
			["Gudang", "perusahaan", "=", bar.perusahaan],
			["Gudang", "kode", "!=", bar.kode_gudang]
		]
	}
}