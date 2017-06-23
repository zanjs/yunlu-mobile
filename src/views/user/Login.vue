<template>
  <section>
    <mt-header title="登陆" class="header">
      <router-link to="/" slot="left">
        <i class="iconfont icon-fanhui"></i>
      </router-link>
    </mt-header>
    <div class="mobile-login-box">
      <div class="row-item">
        <input type="text" placeholder="输入手机号">
      </div>
      <div class="row-item">
        <input type="text" placeholder="请输password">
      </div>
      <div class="row-item">
        <input type="button" value="提交">
      </div>
      <div class="row-item">
        <a>注册账号</a>
        <a>忘记密码</a>
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
  methods: {},
  mounted () {
  }
}
</script>


<style lang="scss">
@import '../../styles/mixin';

/*覆盖mint-ui中nav-bar组件默认样式，故不用scoped*/

.header {
  background-color: $green;
  @include px2rem(height, 88px);
  @include pm2rem(padding, 0px, 30px, 0px, 30px);
  @include font-dpr(17px);
  z-index: 1002 !important;
  h1 {
    @include font-dpr(17px);
  }
  .button-text {
    @include font-dpr(15px);
  }
  i {
    @include font-dpr(20px);
  }
  .icon-fanhui {
    @include font-dpr(25px);
    color: $white;
  }
}

.mobile-login-box {
  margin: 0 auto;
  @include pm2rem(padding, 40px, 0px, 0px, 54px);
  background-color: $white;
  .row-item {
    display: block;
    border: 1px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    @include px2rem(width, 650);
    input {
      background-image: none;
      border-radius: 4px;
      border: 1px solid #bfcbd9;
      box-sizing: border-box;
      font-size: inherit;
      height: 36px;
      line-height: 1;
      outline: 0;
      padding: 3px 10px;
      transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    }
    @include placeholder {
      color: $grey;
    }
    input[type="text"] {
      width: 100%;
      @include px2rem(height, 80);
      @include px2rem(border-radius, 34);
      @include px2rem(margin-bottom, 26);
    }
    input[type="button"] {
      @include px2rem(margin-top, 28);
      @include px2rem(margin-left, 20);
      @include px2rem(margin-bottom, 46);
      @include px2rem(width, 610);
      @include px2rem(height, 80);
      @include font-dpr(16px);
      color: $white;
      background: $green;
    }
    a {
      @include font-dpr(14px);
      color: $grey;
    }
    a:last-child {
      float: right;
    }
  }
}
</style>

