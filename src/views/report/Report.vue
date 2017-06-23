<template>
  <section>
    <mt-header title="投诉"
               fixed
               class="header">
      <router-link to="/folders" slot="left">
        <mt-button>
          <i class="iconfont icon-fanhui"></i>
        </mt-button>
      </router-link>
    </mt-header>
    <div class="tips-container">
      <p>举报违法内容，拒绝恶意侵扰</p>
      <p>清洁共同家园，你我一致行动</p>
    </div>
    <div class="report-list">
      <mt-checklist v-model="value"
                    :options="['色情', '骚扰', '敏感', '诈骗', '暴力恐怖 违禁品 非法传销', '假冒伪劣', '其他']">
      </mt-checklist>
      <div class="text-title">举例补充说明(可选填)</div>
      <div class="textarea-container">
        <textarea class="textarea"
                  placeholder="输入文字说明"></textarea>
      </div>
    </div>
    <mt-button type="primary"
               class="report-btn">提交</mt-button>
  </section>
</template>

<script>
  export default {
    data () {
      return {
        value: []
      }
    },
    methods: {

    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .header {
    background-color: $green;
    @include px2rem(height, 88px);
    @include pm2rem(padding, 0px, 30px, 0px, 30px);
    @include font-dpr(17px);
    position: fixed;
    h1 {
      @include font-dpr(17px);
    }
    .button-text {
      @include font-dpr(15px);
    }
    i {
      @include font-dpr(20px);
    }
  }
  .tips-container {
    background-color: #F2F2F2;
    @include px2rem(margin-top, 88px);
    @include px2rem(height, 116px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    p {
      @include font-dpr(14px);
      color: #A6A6A6;
    }
  }
  .report-list {
    background-color: $white;
    .text-title {
      @include font-dpr(15px);
      color: #A6A6A6;
      @include pm2rem(margin, 30px, 0px, 0px, 30px);
      @include px2rem(padding-bottom, 20px);
    }
    .textarea-container {
      @include pm2rem(padding, 30px, 30px, 170px, 30px);
      background-color: #FAFAFA;
      @include px2rem(margin-bottom, -140px);
      .textarea {
        @include px2rem(height, 300px);
        border: none;
        background-color: #FAFAFA;
        @include px2rem(height, 300px);
        @include font-dpr(15px);
        color: #A6A6A6;
        overflow: auto;
        width: 100%;
      }
      ::-webkit-input-placeholder{
        color: #A6A6A6;
      }
    }
  }
  .report-btn {
    background-color: #52CAA7;
    border-color: #52CAA7;
    @include font-dpr(15px);
    width: 80%;
    position: fixed;
    @include px2rem(bottom, 20px);
    @include px2rem(height, 80px);
    left: 50%;
    -webkit-transform: translateX(-50%);
            transform: translateX(-50%);
  }
</style>

<style lang="scss">
  @import '../../styles/mixin';

  .report-list {
    .mint-checklist-title {
      display: none;
    }
    .mint-cell {
      background-image: none;
    }
    .mint-cell-wrapper {
      background-image: none;
      padding: 0;
      .mint-checklist-label {
        @include pm2rem(padding, 0px, 0px, 0px, 30px);
      }
      .mint-checkbox-label {
        @include font-dpr(16px);
        color: #262626;
        @include px2rem(margin-left, 20px);
      }
    }
    .mint-checkbox-core {
      border: 1px solid #D1D1D1;
      @include px2rem(width, 42px);
      @include px2rem(height, 42px);
    }
    .mint-checkbox-input:checked + .mint-checkbox-core{
      background-color: #52CAA7;
      border-color: #52CAA7;
    }
    a {
      text-decoration: none;
      & :hover {
        text-decoration: none;
      }
    }
    .mint-checkbox-core::after {
      @include px2rem(top, 8px);
      @include px2rem(left, 16px);
      @include px2rem(width, 8px);
      @include px2rem(height, 16px);
    }
  }
</style>
