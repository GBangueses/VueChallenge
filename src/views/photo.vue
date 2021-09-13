<template>
    <div>
        <h1 class="title-text mt-2 ms-4 px-0">List of Images</h1>

        <div class="container">
            <br />
            <h5>A Carousel</h5>
            <br />
            <carousel :perPage=2 :perPageCustom="[[768, 3], [1024, 5]]" @page-change="pageChange" ref="carousel" navigationEnabled :paginationEnabled=loading>
                <template v-for="(p,index) in pictures">
                    <slide :key='index'>
                        <div class="col px-2">
                            <div class="mb-4 image-section image-section">
                                <img loading="lazy" class="card-img-center img-thumbnail rounded-img" src="@/assets/spinner.gif">
                                <div class="overlay">
                                    <a href="#" @click="openDetailModal(p, index)">
                                        <img loading="lazy" :src=p.cropped_picture class="card-img-center img-thumbnail rounded-img" :alt=p.cropped_picture>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </slide>
                </template>

            </carousel>
            <div class="d-flex justify-content-evenly" v-if="!loading">
                <button class="btn btn-primary" :disabled="pageIndex == 1 ? 'disabled' : null" @click="decreasePageIndex()">Previous</button>
                <button class="btn btn-primary" :disabled="!hasMore ? 'disabled' : null" @click="increasePageIndex()">Next</button>
            </div>
        </div>
        <br />

        <div class="container">
        <h5>A simple View</h5>
        <br />
            <div class="d-flex justify-content-center">
                <div class="col-3 d-flex align-items-center" v-if="loading">
                    <strong>Loading Photos...</strong>
                    <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                </div>
            </div>
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-5 row-cols-xg-5">
                <div class="col" v-for="(p, index) in pictures" :key="index">
                    <div class="mb-4 image-section image-section">
                        <img loading="lazy" class="card-img-center img-thumbnail rounded-img" src="@/assets/spinner.gif">
                        <div class="overlay">
                            <a href="#" @click="openDetailModal(p, index)">
                                <img loading="lazy" :src=p.cropped_picture class="card-img-center img-thumbnail rounded-img" :alt=p.cropped_picture>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-evenly" v-if="!loading">
                <button class="btn btn-primary" :disabled="pageIndex == 1 ? 'disabled' : null" @click="decreasePageIndex()">Previous</button>
                <button class="btn btn-primary" :disabled="!hasMore ? 'disabled' : null" @click="increasePageIndex()">Next</button>
            </div>
        </div>
        <br />
        <br />

        <photo-detail-modal :idModal="idModal"
                            :getValues="getValues"
                            @on-next-photo="nextPhoto"
                            @on-previous-photo="previosPhoto">
        </photo-detail-modal>
    </div>
</template>

<script>
    import DaoService from '../services/DaoService';
    import photoDetailModal from './photo-detail-modal.vue'
    import { Carousel, Slide } from 'vue-carousel';

    export default {
        components: { Carousel, Slide, photoDetailModal },
        name: 'Photos',
        props: {
            msg: String
        },
        async created() {
            await this.getPhotos();
        },
        data: function () {
            return {
                pictures: [],
                pageIndex: 1,
                hasMore: true,
                loading: true,
                idModal: "photoDetailModal",
                selectedPictureId: "",
                pictureIndex: "",
            }
        },
        methods: {
            async getPhotos() {
                try {
                    this.loading = true;
                    let response = await DaoService.getPhotos(this.pageIndex);
                    this.loading = false;
                    this.pictures = response.pictures;
                    this.hasMore = response.hasMore;
                    this.pageIndex = response.page;
                } catch (error) {
                    this.$router.push({ name: 'error' });
                }
            },
            pageChange() {
                var currentPage = this.$refs.carousel.currentPage;
                var pageCount = this.$refs.carousel.pageCount;

                return currentPage - pageCount
            },
            getValues() {
                var values = {
                    pictureIndex: this.pictureIndex,
                    selectedPictureId: this.selectedPictureId,
                    topIndexValue: this.pictures.length - 1,
                }

                return values;
            },
            openDetailModal(picture, index) {
                this.selectedPictureId = picture.id;
                this.pictureIndex = index;

                this.$bvModal.show(this.idModal);
            },
            nextPhoto(currentPictureIndex) {
                if (currentPictureIndex < this.pictures.length) {
                    this.pictureIndex = currentPictureIndex + 1
                    var picture = this.pictures[this.pictureIndex];
                    this.selectedPictureId = picture.id;
                }
            },
            previosPhoto(currentPictureIndex) {
                if (currentPictureIndex != 0) {
                    this.pictureIndex = currentPictureIndex - 1
                    var picture = this.pictures[this.pictureIndex];
                    this.selectedPictureId = picture.id;
                }
            },
            async decreasePageIndex() {
                if (this.pageIndex > 1) {
                    this.pageIndex -= 1;
                    this.loading = true;
                    await this.getPhotos();
                    this.loading = false;
                }
            },
            async increasePageIndex() {
                if (this.hasMore) {
                    this.pageIndex += 1;
                    this.pictures = [];
                    this.loading = true;
                    await this.getPhotos();
                    this.loading = false;
                }
            }
        }
    }
</script>

<style scoped>
    .VueCarousel {
        margin-left: 1.5rem;
        margin-right: 1.5rem;
    }
</style>