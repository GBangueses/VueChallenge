<template>
    <div id="app">
        <HeaderBar></HeaderBar>
        <div class="main-section columns">
            <router-view />
        </div>
    </div>
</template>

<script>
    import HeaderBar from '@/components/header-bar';

    export default {
        name: 'App',
        components: { HeaderBar },
    };
</script>

<style src="./design/css/main.css"></style>