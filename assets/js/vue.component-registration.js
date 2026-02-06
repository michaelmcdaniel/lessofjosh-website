(function () { 'use strict';

	var VueComponents = {
		components:[]
	};
	VueComponents.register = function (tag, component) {
		this.components.push({Id:tag,Component: component });
	}

	VueComponents.apply = function (vueApp, tagPrefix) {
		if (typeof tagPrefix == 'undefined' || tagPrefix == null) tagPrefix='';
		let customElements = {};
		this.components.forEach(function(o) {
			if (o.Component) { vueApp.component(tagPrefix+o.Id, o.Component); }
			else { customElements[o.Id] = true; }
		});
		vueApp.config.compilerOptions.isCustomElement = function (tag) { return customElements[tag] === true; }
	}

	window.Components = VueComponents;
}());

if (!Vue.component)
{
	Vue.component = function (id, component) {
		window.Components.register(id, component);
	}
}