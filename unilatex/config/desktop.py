# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from frappe import _

def get_data():
	return [
		{
			"module_name": "Master",
			"color": "grey",
			"icon": "octicon octicon-file-directory",
			"type": "module",
			"label": _("Master")
		},
		{
			"module_name": "Personalia",
			"color": "grey",
			"icon": "octicon octicon-file-directory",
			"type": "module",
			"label": _("Personalia")
		},
		{
			"module_name": "Sparepart",
			"color": "grey",
			"icon": "octicon octicon-file-directory",
			"type": "module",
			"label": _("Sparepart")
		},
		{
			"module_name": "MIS",
			"color": "grey",
			"icon": "octicon octicon-file-directory",
			"type": "module",
			"label": _("MIS")
		}
	]
