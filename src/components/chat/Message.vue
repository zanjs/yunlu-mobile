<template>
  <section class="msg-container">
    <div class="date">
      <span>{{date}}</span>
    </div>
    <div
      v-if="isSelf"
      class="msg-row self">
      <div class="msg-content">
        <div class="bubble bubble-left">
          <div class="content">{{content}}</div>
        </div>
        <div class="arrow arrow-right"></div>
      </div>
      <div class="avatar">
        <img
          v-if="avatar"
          :src="avatar">
        <img
          v-else
          src="../../assets/userAvatarSmall.png">
      </div>
    </div>
    <div
      v-else
      class="msg-row">
      <div class="avatar">
        <img
          v-if="avatar"
          :src="avatar">
        <img
          v-else
          src="../../assets/userAvatarSmall.png">
      </div>
      <div class="msg-content">
        <div class="arrow arrow-left"></div>
        <div class="bubble bubble-right">
          <div class="content">{{content}}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  props: ['isSelf', 'content', 'avatar', 'date'],
  methods: {

  }
}
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin.scss';

  .msg-container {
    @include px2rem(padding-top, 20px);
  }
  .date {
    text-align: center;
    span {
      @include pm2rem(padding, 4px, 20px, 4px, 20px);
      @include px2rem(border-radius, 10px);
      background-color: rgba(232, 220, 220, .5);
      line-height: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: $third-dark;
    }
  }
  .msg-row {
    display: flex;
    align-items: flex-start;
    @include px2rem(padding, 10px);
    .msg-content {
      position: relative;
      display: flex;
      @include px2rem(max-width, 400px);
      @include px2rem(min-height, 80px);
      .bubble {
        position: relative;
        background-color: $green;
        @include pm2rem(padding, 15px, 30px, 15px, 30px);
        @include px2rem(border-radius, 20px);
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .content {
          @include font-dpr(15px);
          @include line-height(20px);
          @include px2rem(max-width, 320px);
          word-wrap: break-word;
          color: $second-dark;
          text-align: left;
        }
      }
      .bubble-left {
        @include px2rem(right, 20px);
        @include px2rem(margin-right, 20px);
        .content {
          color: $white;
        }
      }
      .bubble-right {
        @include px2rem(left, 20px);
        @include px2rem(margin-left, 20px);
        background-color: $fifth-grey;
      }
      .arrow {
        position: absolute;
        @include px2rem(top, 25px);
        @include px2rem(border-top-width, 14px);
        @include px2rem(border-bottom-width, 14px);
        border-bottom-color: transparent;
        border-top-color: transparent;
        border-style: solid;
      }
      .arrow-left {
        @include px2rem(left, 20px);
        @include px2rem(border-right-width, 26px);
        border-right-color: $fifth-grey;
        border-left: none;
      }
      .arrow-right {
        @include px2rem(right, 20px);
        @include px2rem(border-left-width, 26px);
        border-left-color: $green;
        border-right: none;
      }
    }

    .avatar {
      overflow: hidden;
      @include px2rem(width, 80px);
      @include px2rem(height, 80px);
      @include px2rem(border-radius, 40px);
      img {
        height: 100%;
        width: 100%;
      }
    }
  }
  .self {
    justify-content: flex-end;
  }
</style>
