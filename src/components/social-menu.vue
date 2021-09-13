<template>
    <quick-menu class="pointer" :position=position :menu-count=count :icon-class=icons :menu-url-list=list :background-color=backgroundColor @process=navigate></quick-menu>
</template>

<script>
    import quickMenu from 'vue-quick-menu'

    export default {
        components: { quickMenu },
        data: function () {
            return {
                count: 4,
                icons: ["fab fa-github", "fab fa-twitter", "fab fa-whatsapp", "fab fa-linkedin"],
                list: [{ isLink: false, url: "https://github.com/" }, { isLink: false, url: "https://twitter.com/?lang=es" },
                { isLink: false, url: "https://api.whatsapp.com/send?" }, { isLink: false, url: "https://www.linkedin.com/" }],
                position: "top-left",
                backgroundColor: '#138CA3',
            };
        },
        methods: {
            navigate(key) {
                window.open(this.list[key].url)
            }
        }
    };
</script>

<style scoped>
    .quick-menu {
        /* position: absolute !important; */
        top: 60px !important
    }
</style>

