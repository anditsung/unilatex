# -*- coding: utf-8 -*-
# Copyright (c) 2018, unilatex and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Transaksi(Document):
	def masuk(self, arg=None):
		# ambil data dari table
		pesan = ""
		for bar in self.barang_table:
			hasil = self.update_jumlah_stok(bar.gudang_tujuan, bar.barang, bar.nama, bar.jumlah, "masuk")
			pesan = pesan + hasil
			#data = data + bar.barang + "-" + str(bar.jumlah) + "\r"
		return {
			"pesan": pesan
		}
		
	def keluar(self, arg=None):
		pesan = ""
		for bar in self.barang_table:
			hasil = self.update_jumlah_stok(bar.gudang_dari, bar.barang, bar.nama, bar.jumlah, "keluar")
			pesan = pesan + hasil
		return {
			"pesan": pesan
		}
		
	def test(self, arg=None):
		return {
			"pesan": "THIS IS JUST A TEST"
		}
		
	def update_jumlah_stok(self, gudang, barang, nama, jumlah, transaksi):
		kode_stok = barang + "-" + gudang
		stok_barang = frappe.db.get_value("Stok", {"kode_stok": kode_stok})
		if transaksi == 'masuk':
			if stok_barang:
				sb = frappe.get_doc('Stok', stok_barang)
				sb.jumlah = float(sb.jumlah) + jumlah
				sb.save()
				return "Stok untuk {0} telah ditambahkan sebanyak {1} ke Gudang {2}<br>".format(barang, str(jumlah), gudang)
			else:
				sb = frappe.get_doc({
					'doctype': 'Stok',
					'kode_stok': kode_stok,
					'kode_barang': barang,
					'nama_barang': nama,
					'jumlah': jumlah,
					'gudang': gudang,
					'perusahaan': self.perusahaan,
				})
				sb.save()
				return "Stok untuk {0} telah dibuat dan ditambahkan sebanyak {1} ke Gudang {2}<br>".format(barang, str(jumlah), gudang)
		elif transaksi == 'keluar':
			if stok_barang:
				sb = frappe.get_doc('Stok', stok_barang)
				if sb.jumlah < jumlah:
					return "Stok untuk {0} dari Gudang {1} tidak mencukupi<br>".format(barang, gudang)
				else:
					sb.jumlah = float(sb.jumlah) - jumlah
					sb.save()
					return "Stok untuk {0} telah dikurangi sebanyak {1} dari gudang {2}<br>".format(barang, str(jumlah), gudang)
			else:
				return "Stok untuk {0} tidak ditemukan untuk gudang {1}<br>".format(barang, gudang)