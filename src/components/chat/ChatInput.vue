<template>
  <section>
    <div class="input-container full-width">
      <textarea
        class="input"
        v-model="content">
      </textarea>
      <div class="btn">
        <a @click.stop="handleClick">
          <span>发送</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data () {
    return {
      content: ''
    }
  },
  methods: {
    handleClick () {
      let content = this.content
      this.content = ''
      this.$emit('send', content)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/mixin.scss';

.input-container {
  position: fixed;
  bottom: 0;
  display: flex;
  @include px2rem(max-height, 400px);
  @include pm2rem(padding, 10px, 0px, 10px, 0px);
  background-color: #E2E2E2;
  .input {
    @include font-dpr(15px);
    @include px2rem(line-height, 80px);
    @include px2rem(max-height, 300px);
    @include px2rem(height, 80px);
    @include pm2rem(margin, 0px, 10px, 0px, 10px);
    color: $second-dark;
    flex: 1;
    background-color: #fdfdfd;
    border: none;
    resize: none;
  }
  .btn {
    @include pm2rem(margin, 0px, 10px, 0px, 20px);
    display: flex;
    align-items: center;
    justify-content: center;
    color: $white;
    @include font-dpr(16px);
    a {
      display: flex;
      background-color: #43CDFD;
      @include px2rem(width, 120px);
      @include px2rem(height, 80px);
      @include px2rem(border-radius, 20px);
      align-items: center;
      justify-content: center;
      span {
        line-height: 1;
      }
    }
    a:active {
      background-color: rgba(74, 174, 241, .5);
    }
  }
}
</style>
