Vue.component('josh-menu', {
    props: {
        menuItems: { type:Array, default:[] }
    },
    template: `
    <nav id="menu">
        <a v-for="item in menuItems" :title="item.title" :href="item.href">{{item.name}}</a>
    </nav>
    `
})