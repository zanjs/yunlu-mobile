<template>
  <section class="full-width">
    <transition name="fade">
      <div v-show="show" class="full-width filter-bg" @click.stop="closeFilter()"></div>
    </transition>
    <transition name="slide-right">
      <div v-if="show" class="full-width mask">
        <div class="container">
          <div class="wrapper">
            <section class="price-wrapper">
              <p class="title font-14 third-text">
                价格区间(元)
              </p>
              <div class="flex input-container">
                <slot name="input-left"></slot>
                <div class="absolute-horizontal absolute-vertical line"></div>
                <slot name="input-right"></slot>
              </div>
            </section>
            <section class="area-wrapper" v-if="areas && areas.length == 3">
              <p class="title font-14 third-text">区域</p>
              <div class="flex area">
                <a
                  v-for="(item, index) in areas[0].data"
                  :key="index"
                  class="flex item"
                  :class="{'active': selectedArea === item.code}"
                  @click="chooseArea(item.code)">
                  {{item.name}}
                </a>
              </div>
            </section>
            <section class="area-wrapper" v-if="areas && areas.length == 3">
              <p class="title font-14 third-text">城市</p>
              <div class="flex area">
                <a
                  v-for="(item, index) in areas[1].data"
                  :key="index"
                  class="flex item"
                  :class="{'active': selectedArea === item.code}"
                  @click="chooseArea(item.code)">
                  {{item.name}}
                </a>
              </div>
            </section>
            <section class="area-wrapper bottom" v-if="areas && areas.length == 3">
              <p class="title font-14 third-text">省份</p>
              <div class="flex area">
                <a
                  v-for="(item, index) in areas[2].data"
                  :key="index"
                  class="flex item"
                  :class="{'active': selectedArea === item.code}"
                  @click="chooseArea(item.code)">
                  {{item.name}}
                </a>
              </div>
            </section>
          </div>
          <div class="flex buttons">
            <a class="flex" @click="clearArea()">清除</a>
            <a class="flex" @click="save()">确定</a>
          </div>
        </div>
      </div>
    </transition>
  </section>
  </transition>
</template>

<script>
  export default {
    name: 'ProductFilter',
    props: ['show', 'areas', 'selectedArea'],
    data () {
      return {

      }
    },
    methods: {
      closeFilter () {
        this.$emit('close')
      },
      chooseArea (code) {
        this.$emit('choose-area', code)
      },
      clearArea () {
        this.$emit('reset')
      },
      save () {
        this.$emit('save')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .filter-bg {
    position: fixed;
    background-color: rgba(0, 0, 0, .5);
    top: 0;
    bottom: 0;
    z-index: 5;
  }
  .mask {
    position: fixed;
    height: 100%;
    top: 0;
    bottom: 0;
    z-index: 5;
    @include px2rem(margin-left, 150px);
  }
  .container {
    position: relative;
    height: 100%;
    @include px2rem(width, 600px);
    top: 0;
    bottom: 0;
    background-color: $white;
    z-index: 5;
  }
  .wrapper {
    position: relative;
    height: 100%;
    overflow-y: scroll;
    @include pm2rem(margin, 0px, 30px, 0px, 30px);
    @include px2rem(padding-bottom, 80px);
    .title {
      @include pm2rem(margin, 40px, 0px, 20px, 0px);
    }
    .input-container {
      position: relative;
      @include px2rem(width, 480px);
      @include px2rem(height, 80px);
      margin: 0 auto;
      @include px2rem(padding, 10px);
      background-color: $primary-grey;
      justify-content: space-between;
      box-sizing: border-box;
      input {
        @include px2rem(width, 200px);
        @include px2rem(height, 60px);
        line-height: normal;
        border: none;
        @include pm2rem(padding, 0px, 20px, 0px, 20px);
        box-sizing: border-box;
        text-align: center;
        @include font-dpr(14px);
        color: $second-dark;
      }
      ::-webkit-input-placeholder{
        color: $third-dark;
        @include px2rem(height, 60px);
        line-height: normal;
        border: none;
        text-align: center;
      }
      .line {
        @include px2rem(height, 6px);
        @include px2rem(width, 20px);
        background-color: $third-dark;
      }
    }
    .bottom {
      @include px2rem(padding-bottom, 80px);
    }
  }
  .area-wrapper {
    .area {
      flex-wrap: wrap;
      justify-content: flex-start;
      .item {
        @include px2rem(height, 60px);
        @include px2rem(width, 108px);
        line-height: normal;
        color: $primary-dark;
        @include font-dpr(12px);
      }
      a:active {
        background-color: rgba(239, 234, 234, .5);
      }
      .active {
        background-color: #ffe3d6;
        color: $second-red;
      }
    }
  }
  .buttons {
    position: absolute;
    bottom: 0;
    @include px2rem(width, 600px);
    margin: 0;
    @include px2rem(height, 80px);
    border-top: 1px solid $second-grey;
    background-color: $white;
    z-index: 5;
    a {
      flex: 1;
      height: inherit;
      line-height: normal;
      color: $second-red;
      @include font-dpr(14px);
    }
    a:active {
      background-color: rgba(239, 234, 234, .5);
    }
  }

  .slide-right-enter-active, .slide-right-leave-active {
    transition: transform .3s ease-out;
  }
  .slide-right-enter, .slide-right-leave-active {
    transform: translateX(100%);
  }
</style>
