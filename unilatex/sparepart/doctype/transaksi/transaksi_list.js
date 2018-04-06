frappe.listview_settings['Transaksi'] = {
	add_fields: ["transaksi"],
	get_indicator: function(doc) {
		return [__(doc.transaksi), {
			"Barang Masuk": "green",
			"Barang Keluar": "red"
		}[doc.transaksi], "transaksi,=," + doc.transaksi]
	},
	onload: function(listview) {
		/*if(!frappe.route_options) {
			frappe.route_options = {
				"perusahaan": ["=", "Universal Gloves"]
			}
		}*/
	}
}