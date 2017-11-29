<template>
  <section>
    <div
      class="confirm-container full-width">
      <div class="confirm-dialog absolute-horizontal">
        <div class="msg">
          {{msg}}
        </div>
        <div class="btn-group">
          <a
            class="cancel-btn flex"
            @click="handleClick(false)">
            {{cancelText}}
          </a>
          <a
            class="confirm-btn flex"
            @click="handleClick(true)">
            {{okText}}
          </a>
        </div>
      </div>
      <div
        class="confirm-bg full-width"
        id="confirm-bg">
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
  props: {
    msg: {
      reqired: true
    },
    okText: {
      default: '确定'
    },
    cancelText: {
      default: '取消'
    }
  },
  methods: {
    handleClick (bool) {
      this.$emit('click', bool)
    },
    addTouch () {
      document.getElementById('confirm-bg').addEventListener('touchstart', (e) => {
        e.preventDefault()
        this.$emit('click', false)
      })
      document.getElementById('confirm-bg').addEventListener('click', (e) => {
        e.preventDefault()
        this.$emit('click', false)
      })
      document.getElementById('confirm-bg').addEventListener('touchstart', (e) => {
        e.preventDefault()
        this.$emit('click', false)
      })
      document.getElementById('confirm-bg').addEventListener('click', (e) => {
        e.preventDefault()
        this.$emit('click', false)
      })
    }
  },
  mounted () {
    this.addTouch()
  }
}
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .confirm-container {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 1002;
    .confirm-dialog {
      background-color: $white;
      @include px2rem(top, 400px);
      @include px2rem(width, 562px);
      @include px2rem(border-radius, 14px);
      z-index: 1004;
      .msg {
        text-align: center;
        @include pm2rem(padding, 56px, 20px, 56px, 20px);
        line-height: normal;
        @include font-dpr(15px);
        color: $primary-dark;
      }
      .btn-group {
        display: flex;
        align-items: center;
        @include px2rem(height, 88px);
        border-top: 1px solid $second-grey;
        a {
          flex: 1;
          line-height: normal;
          @include  font-dpr(16px);
          color: $second-dark;
          border-right: 1px solid $second-grey;
          height: inherit;
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
    .confirm-bg {
      position: fixed;
      top: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, .45);
      z-index: 1003;
    }
  }
</style>
