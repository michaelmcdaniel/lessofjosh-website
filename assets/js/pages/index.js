if (!window.page) window.page = {};
window.page.vue = {
    computed: {
        WeightLossPct: function () { 
            const lost = this.stats.start - this.stats.current;
            const total = this.stats.start - this.stats.goal;
            return Math.round((lost / total) * 100);
        },
        PoundsToGo: function() {
            return Math.round(this.stats.current - this.stats.goal);
        }
    },
    methods: {

    }
}