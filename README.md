IsoMagic-template
==================

An IsoMagic extension that provides simple templating capabilites for tlc.  Essentially an IsoMagic style clone of `tlc-template`

Config
------

* `templateFiles` (Array<String>) list of files to be loaded and parsed as templates.

#### Template File Structure
* template files are written in html without an <html>, <head>, or <body> tag
* All elements with an id attribute are parsed and loaded as a template.  The id is removed, and becomes their templateid
	* You cannot have nested templates
	* We use the id attribute as a key, and remove it, so that no matter where a template is used in the DOM, it will never create a duplicate id.

Middleware
----------

none included

TLC Formats
-----------

* `template#translate`
	* `--templateid`: required
	* `--data`: optional, default {}.
Translates the appropriate template with the given data, and stores it in the focus variable.  Typically this would be followed by `apply --append;`