<template>
  <div class="photo-container">
    <div v-for="(item, index) in imgs" :key="index">
      <div class="photos-title">{{ item.title }}</div>
      <v-lazy>
        <div class="photos">
          <v-card v-for="img in item.imgs" :key="img.src" class="photo-item">
            <v-img :src="img.src" height="400" width="400"></v-img>
            <v-card-title class="title white--text">
              <v-row class="fill-height flex-column" justify="space-between">
                <p class="mt-4 subheading text-left">{{ img.title }}</p>

                <div>
                  <p class="ma-0 body-1 font-weight-bold font-italic text-left">
                    else text
                  </p>
                  <p class="caption font-weight-medium font-italic text-left">
                    sub text
                  </p>
                </div>
              </v-row>
            </v-card-title>
            <div class="icon-plus">
              <v-btn text fab large color="white" @click="showImg(img.src)">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </div>
          </v-card>
        </div>
      </v-lazy>
      <!-- <div class="ground"></div>
    <div class="teacher"></div>
    <div class="else"></div> -->
      <div class="dialog-container">
        <v-dialog v-model="dialog" max-width="1200px">
          <v-img contain height="800px" :src="showSrc"></v-img>
        </v-dialog>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',

  components: {},
  props: {},
  data: () => ({
    dialog: false,
    showSrc: '',
    imgs: [
      {
        title: 'Pool',
        imgs: [
          {
            title: 'CAD1',
            subtitle: 'sub cad',
            content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum, eius!',
            src: '/imgs/swimming-pool-816394_1920.jpg'
          },
          {
            title: 'CAD2',
            subtitle: 'sub cad',
            content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum, eius!',
            src: '/imgs/woman-in-white-and-red-swimsuit-idiving-in-water-3672647.jpg'
          },
          {
            title: 'CAD3',
            subtitle: 'sub cad',
            content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum, eius!',
            src: '/imgs/feet-1853291_1920.jpg'
          },
          {
            title: 'CAD4',
            subtitle: 'sub cad',
            content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum, eius!',
            src: '/imgs/blue-1839757_1920.jpg'
          }
        ]
      },
      {
        title: 'Teacher',
        imgs: [
          {
            title: 'CAD1',
            subtitle: 'sub cad',
            content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum, eius!',
            src: '/imgs/emilio-garcia-eQfMpQ3WcVY-unsplash.jpg'
          },
          {
            title: 'CAD2',
            subtitle: 'sub cad',
            content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum, eius!',
            src: '/imgs/coach.jpg'
          },
          {
            title: 'CAD3',
            subtitle: 'sub cad',
            content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum, eius!',
            src: '/imgs/sample03b.jpg'
          },
          {
            title: 'CAD4',
            subtitle: 'sub cad',
            content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum, eius!',
            src: '/imgs/pixabay.com2.jpg'
          }
        ]
      },
      {
        title: 'Activiy',
        imgs: [
          {
            title: 'CAD1',
            subtitle: 'sub cad',
            content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum, eius!',
            src: '/imgs/swimming-pool-816394_1920.jpg'
          },
          {
            title: 'CAD2',
            subtitle: 'sub cad',
            content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum, eius!',
            src: '/imgs/woman-in-white-and-red-swimsuit-idiving-in-water-3672647.jpg'
          },
          {
            title: 'CAD3',
            subtitle: 'sub cad',
            content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum, eius!',
            src: '/imgs/feet-1853291_1920.jpg'
          },
          {
            title: 'CAD4',
            subtitle: 'sub cad',
            content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum, eius!',
            src: '/imgs/blue-1839757_1920.jpg'
          }
        ]
      }
    ]
  }),

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {},

  created() {},

  methods: {
    showImg(src) {
      this.dialog = !this.dialog
      this.showSrc = src
    }
  }
}
</script>
<style lang="scss" scoped>
.photo-container {
  display: flex;
  flex-direction: column;
  min-height: 1200px;
  .photos-title {
    font-size: 50px;
    padding-top: 100px;
  }
  .photos {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding-bottom: 300px;

    .photo-item {
      height: 400px;
      width: 400px;
      overflow: hidden;
      margin-bottom: 20px;
      margin-left: 20px;
      @media screen and(max-width:400px) {
        margin-left: 10px;
        margin-right: 10px;
      }
      opacity: 0.6;
      overflow: hidden;
      transition: all 0.3s ease;
      .icon-plus {
        top: 50%;
        left: 50%;
        opacity: 0;
        position: absolute;
        transform: translate(-50%, 300%);
        transition: all 0.3s ease;
      }
      &:hover {
        opacity: 1;
        @include card-hover-boxshadow;
        .icon-plus {
          opacity: 1;
          transform: translate(-50%, -50%);
        }
      }
      .title {
        top: 0;
        width: 100%;
        color: white;
        position: absolute;
      }
    }
  }
}
</style>
