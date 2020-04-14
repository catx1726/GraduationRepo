<template>
  <div class="transition-container d-flex justify-center align-center flex-column">
    <div class="box-center">
      <div class="transition-img">
        <v-img src="/imgs/transition-photo.jpg"></v-img>
      </div>
      <div class="transition-color">
        <div class="text-left">
          <!-- TODO 2020年4月13日 这里一样是一篇文章 -->
          <div class="color-title">
            Me and the Water
          </div>
          <div class="color-button">
            <button>Me and the Water</button>
          </div>
        </div>

        <v-img src="/imgs/transition-color-photo.png"></v-img>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.transition {
  &-container {
    height: 900px;
    width: 100vw;
    @media screen and(max-width: 600px) {
      height: 600px;
    }
    .box-center {
      width: 100vw;
      height: 100%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      position: relative;
    }
  }
  &-img,
  &-color {
    width: 700px;
    @media screen and(max-width: 1920px) {
      width: 700px;
    }
    @media screen and(max-width: 1900px) {
      width: 600px;
    }
    @media screen and(max-width: 1264px) {
      width: 500px;
    }
    @media screen and(max-width: 960px) {
      width: 400px;
    }
    @media screen and(max-width: 400px) {
      width: 300px;
    }
  }
  &-img {
    margin-left: 20%;
    @media screen and(max-width: 1264px) {
      margin-left: 10%;
    }
    @media screen and(max-width: 600px) {
      margin-left: 5px;
    }
  }
  &-color {
    align-self: flex-end;
    position: relative;
    margin-right: 20%;
    margin-top: -200px;
    font-size: 60px;
    @media screen and(max-width: 1920px) {
      margin-top: -200px;
    }
    @media screen and(max-width: 1264px) {
      margin-right: 10%;
      margin-top: -100px;
      font-size: 40px;
    }
    @media screen and(max-width: 600px) {
      margin-right: 5px;
      margin-top: -50px;
      font-size: 30px;
    }
    .color-title,
    .color-button {
      top: 50%;
      left: 50%;
      z-index: 10;
      font-weight: 500;
      position: relative;
      transform: translate(-50%, -50%);
    }
    .color-title {
      color: white;
      font-size: 1em;
    }
    .color-button {
      // top: 80%;
      // mix-blend-mode: screen;
      font-size: 0.3em;
      button {
        padding: 10px 20px;
        color: white;
        border: 5px solid white;
        transition: all 0.3s ease;
        &:hover {
          color: #00adbb;
          background: white;
        }
      }
    }
    .text-left {
      left: 10%;
      width: 80%;
      height: 100%;
      display: flex;
      position: absolute;
      flex-direction: column;
      justify-content: flex-start;
      align-content: flex-start;
    }
  }
}
</style>
