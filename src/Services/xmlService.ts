import { Resx, Datum, DataObject } from "../models/resx";

import convert = require("xml-js");

export function xmlToJson(xml: string) {
	var result = convert.xml2json(xml, {
		compact: true
	});
	return result;
}

export function jsonToXml(json: string) {
	var result = convert.json2xml(json, {
		compact: true
	});
	return result;
}

export function DatumsToXmlDatas(datums: Datum[]) {
	var result: string;
	datums.forEach(datum => {
		var dObj = new DataObject(datum);
		var data = convert.js2xml(dObj, {
			compact: true
		});
		result += data + "\n";
	});
	result = result.substr(9);
	return result;
}

export function xmlToResxObj(xml: string) {
	var json = xmlToJson(xml);
	var result = new Resx(json);
	return result;
}

export function jsonToResxObj(json: any) {
	return new Resx(json);
}
