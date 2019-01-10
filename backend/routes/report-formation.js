const express = require('express');
const router = express.Router();

const fs = require('fs');
const JSZip = require('jszip');
const Docxtemplater = require('docxtemplater');
const path = require('path');
const connection = require('../database/db');

router.get('', (req, res, next) => {
	let content;

	// true/false - статус протоколу "придатний - не придатний"
	if (false) {
		content = fs.readFileSync(path.resolve('./backend/temp/docx', 'svidtemp.docx'), 'binary');
	} else {
		content = fs.readFileSync(path.resolve('./backend/temp/docx', 'dovidtemp.docx'), 'binary');
	}	
	
	let zip = new JSZip(content);

	let doc = new Docxtemplater();
	doc.loadZip(zip);

	doc.setData({
		try_hard: "Fuck це лайно!"
		
		// ТЕГи прописувати тут
	});

	try {
	  // заміна тегів на текст
	  doc.render()
	} catch (error) {
	  let e = {
	    message: error.message,
	    name: error.name,
	    stack: error.stack,
	    properties: error.properties,
	  }
	  console.log(JSON.stringify({
	    error: e
	  }));
	  throw error;
	}

	let buf = doc.getZip().generate({
	  type: 'nodebuffer'
	});

	// buffer перезаписує вміст файлу 
	fs.writeFileSync(path.resolve('./backend/temp/docx', 'output.docx'), buf);
	// Завантаження з серверу
	res.download('./backend/temp/docx/output.docx', 'output.docx');
});

module.exports = router;
