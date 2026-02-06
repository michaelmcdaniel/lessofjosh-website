
document.addEventListener('DOMContentLoaded', function (evnt) {
    let pageVueData = {}
    if (window.page && window.page.vue && window.page.vue.data) {
        if (typeof window.page.vue.data == 'function') pageVueData = window.page.vue.data();
        else pageVueData = window.page.vue.data;
    }

	window.page.vue = Object.assign({}, window.page.vue, { data: function () { return Object.assign({}, pageVueData, window.page.model, {initialized: false}); }});
	window.page.app = Vue.createApp(window.page.vue);
    window.page.vueRoot = null;
	window.Components.apply(window.page.app);
	window.page.vueRoot = window.page.app.mount('#vue-root');

});