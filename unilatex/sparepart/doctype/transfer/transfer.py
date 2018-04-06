# -*- coding: utf-8 -*-
# Copyright (c) 2018, unilatex and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Transfer(Document):
	def transfer(self, arg=None):
		pesan = ''
		for bar in self.transfer_table:
			hasil = self.update_jumlah_stok(bar.barang, bar.nama_barang, bar.stok_gudang, bar.kode_gudang, bar.gudang_tujuan, bar.perusahaan, bar.jumlah)
			pesan = pesan + hasil
		return {
			"pesan": pesan
		}
		
	def update_jumlah_stok(self, kode_barang, nama_barang, kode_stok_awal, kode_gudang_awal, kode_gudang_tujuan, perusahaan_tujuan, jumlah):
		kode_stok_tujuan = kode_barang + "-" + kode_gudang_tujuan
		stok_barang_awal = frappe.db.get_value("Stok", {"kode_stok": kode_stok_awal})
		stok_barang_tujuan = frappe.db.get_value("Stok", {"kode_stok": kode_stok_tujuan})
		if stok_barang_tujuan:
			sba = frappe.get_doc('Stok', stok_barang_awal)
			sbt = frappe.get_doc('Stok', stok_barang_tujuan)
			sbt.jumlah = sbt.jumlah + jumlah
			sba.jumlah = sba.jumlah - jumlah
			sbt.save()
			sba.save()
			return "Stok untuk {0}({1}) telah ditransfer sebanyak {2} dari {3}({4}) ke {5}({6})<br>".format(nama_barang, kode_barang, str(jumlah), self.perusahaan, kode_gudang_awal, perusahaan_tujuan, kode_gudang_tujuan)
		else:
			sb = frappe.get_doc({
				'doctype': 'Stok',
				'kode_stok': kode_stok_tujuan,
				'kode_barang': kode_barang,
				'nama_barang': nama_barang,
				'jumlah': jumlah,
				'gudang': gudang_tujuan,
				'perusahaan': perusahaan_tujuan,
			})
			sba = frappe.get_doc('Stok', stok_barang_awal)
			sba.jumlah = sba.jumlah - jumlah
			sba.save()
			sb.save()
			return "Stok untuk {0}({1}) telah dibuat dan ditransfer sebanyak {2} dari {3}({4}) ke {5}({6})<br>".format(nama_barang, kode_barang, str(jumlah), self.perusahaan, kode_gudang_awal, perusahaan_tujuan, kode_gudang_tujuan)