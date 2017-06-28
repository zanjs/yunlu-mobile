<template>
  <section>
    <mt-header title="资信"
               fixed
               class="header">
      <router-link to="/enterprisecarte" slot="left">
        <mt-button>
          <i class="iconfont icon-fanhui"></i>
        </mt-button>
      </router-link>
      <router-link to="/" slot="right">
        <mt-button>
          <i class="iconfont icon-zhuye"></i>
        </mt-button>
      </router-link>
    </mt-header>
    <div class="container">
      <div class="detail-container">
        <div class="name-info">
          <p>{{comityDetail.name}}</p>
          <div class="rate">
            <i class="iconfont icon-icon-test1 selected"></i>
            <i class="iconfont icon-icon-test1 selected"></i>
            <i class="iconfont icon-icon-test1 selected"></i>
            <i class="iconfont icon-icon-test1 selected"></i>
            <i class="iconfont icon-icon-test1"></i>
            <i class="iconfont icon-icon-test1"></i>
          </div>
          <div class="level">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-v3"></use>
            </svg>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-v2"></use>
            </svg>
          </div>
        </div>
        <div
          v-if="comityDetail && comityDetail.enttype"
          class="item">
          <span class="label">机构状态</span>
          <span class="content">{{comityDetail.enttype}}</span>
        </div>
        <div
          v-if="comityDetail && comityDetail.organization && comityDetail.organization.legal_person"
          class="item">
          <span class="label">法定代表人</span>
          <span class="content">{{comityDetail.organization.legal_person}}</span>
        </div>
        <div
          v-if="comityDetail && comityDetail.info_id"
          class="item">
          <span class="label">注册号</span>
          <span class="content">{{comityDetail.info_id}}</span>
        </div>
        <div
          v-if="comityDetail && comityDetail.address"
          class="item">
          <span class="label">住所</span>
          <span class="content">{{comityDetail.address}}</span>
        </div>
        <div
          v-if="comityDetail && comityDetail.reg_org"
          class="item">
          <span class="label">登记机关</span>
          <span class="content">{{comityDetail.reg_org}}</span>
        </div>
        <div
          v-if="false"
          class="item">
          <span class="label">机构代码</span>
          <span class="content">4200000000000</span>
        </div>
        <div
          v-if="false"
          class="item">
          <span class="label">信用代码</span>
          <span class="content">43000000000000</span>
        </div>
        <div
          v-if="false"
          class="link-container">
          <div class="label">社会认证</div>
          <div class="link">
            <a class="row">
              <span>yao协会</span>
              <i class="iconfont icon-fanhui"/>
            </a>
            <a class="row">
              <span>湖北省石材工业协会</span>
              <i class="iconfont icon-fanhui"/>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import { getStore } from '../../config/mUtils'
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        token: getStore('user') ? getStore('user').authentication_token : '',
        teamId: getStore('enterpriseDetailParams') ? getStore('enterpriseDetailParams').teamId : this.$route.params.teamId
      }
    },
    methods: {
      getEnterpriseDetail () {
        this.$store.dispatch('commonAction', {
          url: `/enterprises/${this.teamId}/details`,
          method: 'get',
          params: {
            token: this.token
          },
          target: this,
          resolve: (state, res) => {
            state.comityDetail = res.data.enterprises
          },
          reject: () => {
          }
        })
      }
    },
    mounted () {
      this.getEnterpriseDetail()
    },
    computed: {
      ...mapGetters([
        'comityDetail'
      ])
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
  }
  .container {
    @include px2rem(padding-top, 88px);
  }
  .detail-container {
    @include pm2rem(margin, 20px, 30px, 0px, 30px);
    @include pm2rem(padding, 38px, 22px, 0px, 22px);
    background-color: $white;
    .name-info {
      @include px2rem(padding-bottom, 18px);
      p {
        @include font-dpr(15px);
        color: #262626;
        line-height: 1;
      }
      .rate {
        @include pm2rem(margin, 32px, 0px, 22px, 0px);
        @include font-dpr(15px);
        line-height: 1;
        color: #A6A6A6;
        i {
          @include px2rem(margin-right, 12px);
        }
        .selected {
          color: #F7D14E;
        }
      }
      .level {
        @include font-dpr(23px);
        line-height: 1;
      }
    }
    .item {
      border-top: 1px dashed #D1D1D1;
      @include px2rem(height, 78px);
      @include font-dpr(14px);
      @include px2rem(line-height, 78px);
      .label {
        @include px2rem(width, 186px);
        display: inline-block;
      }
    }
    .link-container {
      border-top: 1px dashed #D1D1D1;
      @include font-dpr(14px);
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .label {
        @include px2rem(width, 186px);
      }
      .link {
        flex: 1;
        .row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          @include pm2rem(padding, 20px, 0px, 20px, 0px);
        }
        i {
          transform: rotateY(180deg);
          @include font-dpr(15px);
          color: #52CAA7;
        }
        a {
          text-decoration: none;
        }
        a:active {
          background-color: #F2F2F2;
        }
      }
    }
  }
</style>
