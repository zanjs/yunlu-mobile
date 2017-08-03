<template>
  <section>
    <common-header
      :title="header"
      @back="goBack()">
    </common-header>
    <div class="tips-container">
      <p>举报违法内容，拒绝恶意侵扰</p>
      <p>清洁共同家园，你我一致行动</p>
    </div>
    <div class="report-list">
      <radio-list
        :store="options"
        :value="value"
        @checked="checkItem">
      </radio-list>
      <div class="text-title">举例补充说明(可选填)</div>
      <div class="textarea-container">
        <textarea
          class="textarea"
          placeholder="输入文字说明"></textarea>
      </div>
    </div>
    <div class="report-btn">
      <a @click="beforeReport()">提交</a>
    </div>
    <template v-if="reportSuccess">
      <div class="dialog-bg">
      </div>
      <div class="success-dialog">
        <div class="img-container">
          <img src="../../assets/reportSuccess.png">
        </div>
        <div class="content">
          <p>感谢您的支持，我们会尽快处理。</p>
          <p class="count">举报次数+1</p>
          <a @click="closeDialog()">返回云视首页</a>
        </div>
      </div>
    </template>
  </section>
</template>

<script>
  import { getStore, removeStore } from '../../config/mUtils'
  import RadioList from '../../components/common/RadioList'
  import CommonHeader from '../../components/header/CommonHeader'
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
        header: '投诉',
        value: null,
        token: getStore('user') ? getStore('user').authentication_token : '',
        resourceId: this.$route.query.resourceId,
        resourceClass: this.$route.query.resourceClass,
        reportSuccess: false
      }
    },
    components: {
      CommonHeader,
      RadioList
    },
    methods: {
      beforeReport () {
        if (!this.value) {
          Toast({
            message: '请选择投诉类型',
            duration: 1000
          })
          return false
        } else {
          this.report()
        }
      },
      report () {
        this.$store.dispatch('commonAction', {
          url: '/reports',
          method: 'post',
          params: {
            ...(this.token ? {token: this.token} : {}),
            clazz: this.value,
            resource_id: this.resourceId,
            resourceClass: this.resourceClass,
            ...(this.description ? {description: this.description} : {})
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.success) {
              this.reportSuccess = true
            }
          },
          reject: () => {
          }
        })
      },
      checkItem (val) {
        this.value = val
      },
      closeDialog () {
        this.reportSuccess = false
        this.goHome()
      },
      goHome () {
        this.$router.replace({name: 'See'})
      },
      goBack () {
        if (getStore('Report_goHome')) {
          removeStore('Report_goHome')
          this.$router.replace({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .tips-container {
    background-color: $tenth-grey;
    @include px2rem(margin-top, 88px);
    @include px2rem(height, 116px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    p {
      @include font-dpr(14px);
      color: $third-dark;
    }
  }
  .report-list {
    background-color: $white;
    .text-title {
      @include font-dpr(15px);
      color: $third-dark;
      @include pm2rem(margin, 30px, 0px, 0px, 30px);
      @include px2rem(padding-bottom, 20px);
    }
    .textarea-container {
      @include pm2rem(padding, 30px, 30px, 170px, 30px);
      background-color: $sixth-grey;
      @include px2rem(margin-bottom, -140px);
      .textarea {
        @include px2rem(height, 300px);
        border: none;
        background-color: $sixth-grey;
        @include px2rem(height, 300px);
        @include font-dpr(15px);
        color: $third-dark;
        overflow: auto;
        width: 100%;
        resize: none;
      }
      ::-webkit-input-placeholder{
        color: $third-dark;
      }
    }
  }
  .report-btn {
    background-color: $green;
    border-color: $green;
    @include font-dpr(15px);
    color: $white;
    position: fixed;
    @include px2rem(bottom, 20px);
    @include px2rem(height, 80px);
    left: 50%;
    transform: translateX(-50%);
    a {
      display: block;
      @include px2rem(width, 600px);
      text-align: center;
      @include px2rem(line-height, 80px);
    }
    a:active {
      background-color: rgba(82, 202, 167, .5);
    }
  }
  .dialog-bg {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1004;
    background-color: rgba(0, 0, 0, .45);
  }
  .success-dialog {
    @include px2rem(width, 562px);
    position: fixed;
    @include px2rem(top, 200px);
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 1005 !important;
    .img-container {
      @include px2rem(width, 562px);
      @include px2rem(height, 213px);
      img {
        width: 100%;
        height: 100%;
      }
    }
    .content {
      background-color: $white;
      text-align: center;
      @include pm2rem(padding, 22px, 0px, 26px, 0px);
      p {
        @include font-dpr(15px);
        color: $second-dark;
        line-height: 1;
      }
      .count {
        color: #FF0000;
        @include font-dpr(14px);
        @include px2rem(margin-top, 26px);
      }
      a {
        display: block;
        margin: 0 auto;
        @include px2rem(margin-top, 38px);
        background-color: $green;
        color: $white;
        @include px2rem(height, 66px);
        @include px2rem(line-height, 66px);
        @include font-dpr(14px);
        @include px2rem(width, 310px);
      }
      a:active {
        background-color: rgba(82, 202, 167, .5);
      }
    }
  }
</style>
