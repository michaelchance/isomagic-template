/******************************************************************************
 * @module isomagic-template
 *
 * IsoMagic extension that provides the following TLC commands:
 * 		
 *		template#translate
 *			--templateid [required]
 *			--data	[default: null]
 *			Translates the given templateid, if loaded, with the given data, and stores it in the tlc focus variable
 *			
 * @param {Array<string>} templateFiles list of files to be loaded and parsed
 * 
 * Template File Structure
 * 		template files are written in html without an <html>, <head>, or <body> tag
 *		All elements with an id attribute are parsed and loaded as a template.  The id is removed, and becomes their templateid
 *			*note You cannot have nested templates
 *			*note We use the id attribute as a key, and remove it, so that no matter where a template is used in the DOM, it will never create a duplicate id.
 * 
 *****************************************************************************/

(function(){
	var extname = "template";
	
	var extension = function(_app, config){
		var templates = {};
		var r = {
			tlc : {
				translate : function(context){
					var templateid = context.args('templateid');
					var data = context.args('data');
					// console.log('translating '+templateid);
					var r = false;
					if(templateid && templates[templateid]){
						var $tag = templates[templateid].clone();
						r = context.tlc.run($tag,data,context.options);
						var html = "";
						if(_app.server()){
							html = require('cheerio').html($tag);
							}
						else {
							html = $tag;
							}
						context.focus(html);
						}
					return r;
					}
				}
			}
		
		for(var i in config.templateFiles){
			if(_app.server()){
				var cheerio = require('cheerio');
				var fs = require('fs');
				fs.readFile(config.templateFiles[i],'utf-8',function(err,result){
					if(err){
						// console.error(err);
						}
					else if (result){
						var $ = cheerio.load(result);
						$('[id]').each(function(i,e){
							templates[$(this).attr('id')] = $(this).removeAttr('id');
							});
						}
					});
				}
			else {
				$.get(config.templateFiles[i], function(data){
					var $templateFile = $('<div/>');
					$templateFile.html(data);
					$('[id]', $templateFile).each(function(){
						templates[$(this).attr('id')] = $(this).removeAttr('id');
						});
					});
				}
			}
		
		return r;
		}
	// Only Node.JS has a process variable that is of [[Class]] process 
	var isNode = false;
	try {isNode = Object.prototype.toString.call(global.process) === '[object process]';} catch(e) {}
	if(isNode){	root = {};}
	else {root = window;}
	
	if(isNode){
		module.exports = extension;
		}
	else {
		window[extname] = extension;
		}
	
	})()