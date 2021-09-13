<template>
    <div >
        <b-modal :id="idModal" hide-footer dialog-class="modal-dialog modal-dialog-scrollable modal-fullscreen">
            <template #modal-title>
                <span class="title-text mt-2 ms-4 px-0">Photo Details</span>
            </template>
            <template #modal-header-close>
                <button type="button" class="btn-close" @click="closeModal"></button>
            </template>

            <div class="col-3 d-flex align-items-center" v-if="!full_picture">
                    <strong>Loading Photo...</strong>
                    <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                </div>

            <div class="card" style="max-width: fit-content;">
                <image-zoom :regular=cropped_picture
                            :zoom=full_picture
                            :zoom-amount="4">
                </image-zoom>
            </div>
            <br />
            <div class="card text-white img-full">
                <img class="card-img img-full" :src=full_picture alt="Card image" v-if="full_picture">
                <div class="card-img-overlay">
                    <h5 class="card-title">{{author}}</h5>
                    <p class="card-text">{{camera}}</p>
                    <p class="card-text">{{tags}}</p>
                    <div class="carousel-control-prev .pointer-none">
                        <button :class="pictureIndex == 0 ? 'disabled-arrow-button' : ''" :disabled="pictureIndex == 0 ? 'disabled' : null" aria-hidden="true" class="carousel-control-prev-icon btn btn-primary-outline" @click="previousPhoto"></button>
                    </div>
                    <div class="carousel-control-next .pointer-none">
                        <button :class="pictureIndex == topIndexValue ? 'disabled-arrow-button' : ''" :disabled="pictureIndex == topIndexValue ? 'disabled' : null" aria-hidden="true" class="carousel-control-next-icon btn btn-primary-outline" @click="nextPhoto"></button>
                    </div>
                </div>
            </div>
        </b-modal>

</div>
</template>
<script></script>

<script>
    import DaoService from '../services/DaoService';
    import SocialMenu from "../components/social-menu.vue"
    import imageZoom from 'vue-image-zoomer';

    export default {
        components: { DaoService, SocialMenu, imageZoom },
        name: "photo-detail-modal",
        props: {
            idModal: String,
            getValues:Function,
        },
        data: function () {
            return {
                pictureId: '',
                author: '',
                camera: '',
                tags: '',
                cropped_picture: '',
                full_picture: '',
                pictureIndex: '',
                topIndexValue: '',
            };
        },
        created() {
        },
        mounted() {            
            this.$root.$on('bv::modal::show', (bvEvent, modalId) => {
                this.loadData();
            })
        },
        methods: {
            async loadData() {
                var values = this.getValues();
                this.photoId = values.selectedPictureId;
                this.pictureIndex = values.pictureIndex;
                this.topIndexValue = values.topIndexValue;

                try {
                    this.loading = true;
                    let response = await DaoService.getIndividualPhoto(this.photoId);
                    this.loading = false;
                    this.pictureId = response.id;
                    this.author = response.author;
                    this.camera = response.camera;
                    this.tags = response.tags;
                    this.cropped_picture = response.cropped_picture;
                    this.full_picture = response.full_picture;
                } catch (error) {
                    console.log(error);
                    this.$router.push({ name: 'error' });
                }
            },
            modalClosed: function () {
                this.pictureId = '';
                this.author = '';
                this.camera = '';
                this.tags = '';
                this.cropped_picture = '';
                this.full_picture = '';
                this.pictureIndex = '';
                this.topIndexValue = '';
            },
            selectValue(item) {
                item.selected = !item.selected;
            },
            closeModal() {
            },
            nextPhoto() {
                this.$emit("on-next-photo", this.pictureIndex);

                this.loadData();
            },
            previousPhoto() {
                this.$emit("on-previous-photo", this.pictureIndex);

                this.loadData();
            }
        },
    };

</script>

<style scoped>
.pointer-none {
	cursor: default !important;
    z-index: 0 !important;
}
    .overlay-element {
      z-index: 2;
    }
    .disabled-arrow-button {
        display: none
    }
</style>