const express = require('express');
const router = express.Router();

const fs = require('fs');
const JSZip = require('jszip');
const Docxtemplater = require('docxtemplater');
const path = require('path');
const connection = require('../database/db');

router.get('', (req, res, next) => {
	var content = fs.readFileSync(path.resolve('backend/temp/docx', 'dovidtemp.docx'), 'binary');
	
	var zip = new JSZip(content);

	var doc = new Docxtemplater();
	doc.loadZip(zip);

	doc.setData({
	  try_hard: "Fuck це лайно!"
	});

	try {
	  // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
	  doc.render()
	} catch (error) {
	  var e = {
	    message: error.message,
	    name: error.name,
	    stack: error.stack,
	    properties: error.properties,
	  }
	  console.log(JSON.stringify({
	    error: e
	  }));
	  // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
	  throw error;
	}

	var buf = doc.getZip().generate({ type: 'nodebuffer' });

	// buf is a nodejs buffer, you can either write it to a file or do anything else with it.
	fs.writeFileSync(path.resolve('../backend/temp/docx', 'output.docx'), buf);
	res.send('done');
});

module.exports = router;
