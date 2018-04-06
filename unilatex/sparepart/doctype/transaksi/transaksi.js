// Copyright (c) 2018, unilatex and contributors
// For license information, please see license.txt

frappe.ui.form.on('Transaksi', {
	refresh: function(frm) {
		if(!frm.doc.__islocal) {
			frm.disable_save()
		}
	},
	onload: function(frm) {
		if (frm.doc.__islocal) {
			frm.set_value("id_bak", frm.doc.naming_series)
			frm.enable_save();
			
			/*frappe.call({
				method: "frappe.client.get",
				args: {
					doctype:"Karyawan",
					filters: {
						user_id: frappe.user.name
					},
					fieldname: ["perusahaan"]
				},
				callback: function(r) {
					cur_frm.set_query("perusahaan", function() {
						return {
							"filters": {
								"name": r.message.perusahaan
							}
						}
					})
				}
			})*/
			
			if(frappe.session.user.includes('@')) {
				frappe.call({
					method: 'frappe.client.get',
					args: {
						doctype: "Karyawan",
						filters: {
							user_id: frappe.session.user
						}
					},
					callback: function(r) {
						//console.log("perusahaan" + r.message)
						if(r.message.perusahaan != 'ALL' && r.message) {
							cur_frm.set_query("perusahaan", function() {
								return {
									"filters": {
										"name": r.message.perusahaan
									}
								}
							})
						}
					}
				})
			}
			
			//console.log(frappe)
			/*frappe.call({
				method: 'frappe.client.get',
				args: {
					doctype: "Karyawan",
					filters: {
						user_id : frappe.session.user
					}
				},
				callback: function(r) {
					frm.set_value("perusahaan", r.message.perusahaan)
				}
			})*/
			/*frappe.call({
				method: "frappe.client.get",
				args: {
					doctype: "Karyawan",
					user_id: frappe.session.user
				},
				callback: function(r) {
					console.log(r)
				}
			})*/
			/*console.log(frappe.session.user_fullname)
			console.log(frappe.session.user)
			cur_frm.add_fetch(frappe.session.user_fullname, "karyawan_user", "karyawan_user")*/
			//cur_frm.add_fetch(, "perusahaan", "perusahaan")
			/*frappe.call({
				method:	'frappe.client.get_value'
				args: {
					doctype: 'Karyawan',
					filters: [
						['Karyawan', 'user_id', '=', frappe.session.user]
					]
				},
				callback: function(r) {
					console.log(r)
				}
			})*/
		}
		else {
			frm.disable_save()
		}
	},
	kode_perusahaan: function(frm) {
		var naming_series = frm.doc.id_bak
		naming_series = naming_series.replace("ZZ", frm.doc.kode_perusahaan)
		frm.set_value("naming_series", naming_series)
	},
	transaksi: function(frm) {
		// filter karyawan base on gudang and perusahaan
		cur_frm.set_query("karyawan", function() {
			return {
				"filters": {
					"perusahaan": frm.doc.perusahaan
				}
			}
		})
		
		if(frm.doc.transaksi == "Barang Masuk") {
			/*
			cara lain untuk filter barang
			cur_frm.set_query("barang", "barang", function() {
				return {
					"filters": {
						"aktif": true
					}
				}
			})*/
			frm.fields_dict.barang_table.grid.get_field('barang').get_query = function() {
				return {
					"filters": {
						"aktif": true
					}
				}
			}
		}
		else if(frm.doc.transaksi == "Barang Keluar") {
			cur_frm.set_query("barang", "barang_table", function() {
				return {}
			})
		}
		
		// always empty table when changing transaksi
		frm.set_value("barang_table", "")
	},
	validate: function(frm, cdt, cdn) {
		var tmethod = "test"
		var save = true
		var breakException = {}
		
		if(frm.doc.transaksi == "Barang Masuk") {
			tmethod = "masuk"
			try {
				frm.doc.barang_table.forEach(function(barang) {
					if(barang.jumlah <= 0) {
						var msg = "Jumlah barang masuk untuk " + barang.nama + " ( " + barang.barang + " ) tidak boleh 0, index ( " + barang.idx + " )"
						frappe.msgprint(msg)
						frappe.validated = false
						save = false
						throw breakException
					}
				})
			} catch(e) {
				if( e !== breakException ) throw e
			}
		}
		else if(frm.doc.transaksi == "Barang Keluar") {
			tmethod = "keluar"
			try {
				frm.doc.barang_table.forEach(function(barang) {
					if(barang.jumlah <= 0) {
						var msg = "Jumlah barang keluar untuk " + barang.nama + " ( " + barang.barang + " ) tidak boleh 0, index ( " + barang.idx + " )"
						frappe.msgprint(msg)
						frappe.validated = false
						save = false
						throw breakException
					}
					
					if(barang.jumlah > barang.sisa_stok) {
						var msg = "Jumlah barang keluar untuk " + barang.nama + " ( " + barang.barang + " ) tidak boleh lebih banyak dari stok yang ada, index ( " + barang.idx + " )"
						frappe.msgprint(msg)
						frappe.validated = false
						save = false
						throw breakException
					}
				})
			} catch (e) {
				if( e !== breakException) throw e
			}
		}
		
		if(save) {
			frappe.call({
				method: tmethod,
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

cur_frm.fields_dict['barang_table'].grid.get_field('stok_gudang').get_query = function(frm, cdt, cdn) {
	var bar = locals[cdt][cdn]
	return {
		"filters": [
			["Stok", "kode_barang", "=", bar.barang ], // filter stok barang di gudang berdasarkan kode barang
			["Stok", "perusahaan", "=", frm.perusahaan], // filter stok barang di gudang berdasarkan lokasi stok
			["Stok", "jumlah", ">", 0] // filter stok barang di gudang yang stoknya diatas 0
		]
	}
}

frappe.ui.form.on("Transaksi Barang", {
	barang: function(frm, cdt, cdn) { // [object Object] Transaksi Barang New Transaksi Barang 1 // frm, cdt, cdn
		if(frm.doc.transaksi == "Barang Keluar") {
			var bar = locals[cdt][cdn]
			var kode_barang = bar.barang
			/*cur_frm.set_query("stok_gudang", "barang_table", function() {
				return {
					"filters": {
						"kode_barang": kode_barang
					}
				}
			})*/
			/*frm.fields_dict.barang_table.grid.get_field('stok_gudang').get_query = function() {
				return {
					"filters": {
						"kode_barang": kode_barang
					}
				}
			}*/
			/*cur_frm.fields_dict.barang.get_query = function() {
				return {
					"filters": {
						"kode_barang": bar.barang
					}
				}
			}*/
			
		}
	},
	barang_add: function(frm) {
		//console.log("add-barang")
	}
})