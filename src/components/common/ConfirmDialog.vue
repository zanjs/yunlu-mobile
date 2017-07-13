<template>
  <section>
    <div class="confirm-bg">
      <div class="confirm-dialog">
        <div class="msg">
          {{msg}}
        </div>
        <div class="btn-group">
          <a
            class="cancel-btn"
            @click="handleClick(false)">
            取消
          </a>
          <a
            class="confirm-btn"
            @click="handleClick(true)">
            确定
          </a>
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
  name: 'ConfirmDialog',
  props: ['msg'],
  methods: {
    handleClick (bool) {
      this.$emit('click', bool)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .confirm-bg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .45);
    z-index: 1002;
    .confirm-dialog {
      position: absolute;
      background-color: $white;
      @include px2rem(top, 400px);
      @include px2rem(width, 562px);
      left: 50%;
      transform: translateX(-50%);
      @include px2rem(border-radius, 14px);
      @include px2rem(height, 240px);
      .msg {
        @include px2rem(height, 94px);
        text-align: center;
        @include px2rem(padding-top, 56px);
        line-height: 1;
        @include font-dpr(15px);
        color: #262626;
      }
      .btn-group {
        display: flex;
        align-items: center;
        @include px2rem(height, 88px);
        border-top: 1px solid #E0E0E0;
        a {
          flex: 1;
          line-height: 1;
          @include  font-dpr(16px);
          color: #595959;
          border-right: 1px solid #E0E0E0;
          height: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        a:active {
          background-color: rgba(239, 234, 234, .5);
        }
        .cancel-btn {
          @include px2rem(border-bottom-left-radius, 14px);
        }
        .confirm-btn {
          color: #FE0000;
          border: none;
          @include px2rem(border-bottom-right-radius, 14px);
        }
      }
    }
  }
</style>
