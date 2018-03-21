// Copyright (c) 2018, unilatex and contributors
// For license information, please see license.txt

frappe.ui.form.on("Naming Series", {
        onload: function(frm) {
                frm.disable_save();
                frm.events.get_doc_and_prefix(frm);
        },

        get_doc_and_prefix: function(frm) {
                frappe.call({
                        method: "get_transactions",
                        doc: frm.doc,
                        callback: function(r) {
                                frm.set_df_property("select_doc_for_series", "options", r.message.transactions);
                                frm.set_df_property("prefix", "options", r.message.prefixes);
                        }
                });
        },

        select_doc_for_series: function(frm) {
                if(frm.doc.select_doc_for_series) {
			setup_naming_display(frm, false)
			frm.set_value("user_must_always_select", 0);
	                frappe.call({
        	                method: "get_options",
                	        doc: frm.doc,
                        	callback: function(r) {
            	                	frm.set_value("set_options", r.message);
                	                	if(r.message && r.message.split('\n')[0]=='')
                                        		frm.set_value('user_must_always_select', 1);
                                		frm.refresh();
                        	}
                	});
		}
		else {
			setup_naming_display(frm, true)
		}
        },

        prefix: function(frm) {
                frappe.call({
                        method: "get_current",
                        doc: frm.doc,
                        callback: function(r) {
                                frm.refresh_field("current_value");
                        }
                });
        },

        update: function(frm) {
                frappe.call({
                        method: "update_series",
                        doc: frm.doc,
                        callback: function(r) {
                                frm.events.get_doc_and_prefix(frm);
                        }
                });
        }
});


function setup_naming_display(frm, hide) {
	frm.set_df_property("help_html", "hidden", hide)
	frm.set_df_property("set_options", "hidden", hide)
	frm.set_df_property("user_must_always_select", "hidden", hide)
	frm.set_df_property("update", "hidden", hide)
}
