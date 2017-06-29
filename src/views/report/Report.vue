<template>
  <section>
    <mt-header title="投诉"
               fixed
               class="header">
      <mt-button slot="left"
                 @click="goBack()"
                 class="button-text">
        <i class="iconfont icon-fanhui"></i>
      </mt-button>
    </mt-header>
    <div class="tips-container">
      <p>举报违法内容，拒绝恶意侵扰</p>
      <p>清洁共同家园，你我一致行动</p>
    </div>
    <div class="report-list">
      <mt-checklist
        v-model="values"
        :max="1"
        :options="options">
      </mt-checklist>
      <div class="text-title">举例补充说明(可选填)</div>
      <div class="textarea-container">
        <textarea
          class="textarea"
          placeholder="输入文字说明"></textarea>
      </div>
    </div>
    <mt-button
      type="primary"
      @click="report()"
      class="report-btn">提交</mt-button>
  </section>
</template>

<script>
  import { getStore } from '../../config/mUtils'
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        options: [
          {
            label: '色情',
            value: 1
          }, {
            label: '骚扰',
            value: 2
          }, {
            label: '敏感',
            value: 3
          }, {
            label: '诈骗',
            value: 4
          }, {
            label: '暴力恐怖 违禁品 非法传销',
            value: 5
          }, {
            label: '假冒伪劣',
            value: 6
          }, {
            label: '其他',
            value: 99
          }
        ],
        values: [],
        token: getStore('user') ? getStore('user').authentication_token : '',
        resourceId: this.$route.params.resourceId,
        resourceClass: this.$route.params.resourceClass
      }
    },
    methods: {
      report () {
        this.$store.dispatch('commonAction', {
          url: '/reports',
          method: 'post',
          params: {
            ...(this.token ? {token: this.token} : {}),
            clazz: this.values[0],
            resource_id: this.resourceId,
            resourceClass: this.resourceClass,
            ...(this.description ? {description: this.description} : {})
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.success) {
              this.autoGoBack()
            }
          },
          reject: () => {
          }
        })
      },
      autoGoBack () {
        let toast = Toast({
          message: '举报成功',
          duration: 2000
        })
        setTimeout(() => {
          toast.close()
          if (this.$route.params && this.$route.params.backUrl) {
            this.$router.push({name: this.$route.params.backUrl})
          } else {
            this.$router.push({name: 'See'})
          }
        }, 2000)
      },
      goBack () {
        this.$router.go(-1)
        // if (getStore('reportParams') && getStore('reportParams').backUrl) {
        //   this.$router.push({name: getStore('reportParams').backUrl})
        // } else {
        //   this.$router.push({name: 'See'})
        // }
      }
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
