<template>
  <section>
    <common-header
      :title="header"
      @back="goBack()">
    </common-header>
    <section class="info">
      <img
        v-lazy="{
          src: logo,
          error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png',
          loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'
        }">
      <div class="content">
        <div class="item">
          <span class="status">物流状态：</span>
          <span
            v-if="traceInfo && traceInfo.express_state"
            class="danger">
            {{traceInfo.express_state | status}}
          </span>
          <span v-else></span>
        </div>
        <div class="item">
          <span>物流公司：</span>
          <span v-if="traceInfo && traceInfo.express_company && traceInfo.express_company.name">{{traceInfo.express_company.name}}</span>
          <span v-else></span>
        </div>
        <div class="item">
          <span>运单编号：</span>
          <span
            v-if="traceInfo && traceInfo.express_number"
            class="danger">
            {{traceInfo.express_number}}
          </span>
          <span v-else></span>
        </div>
        <div class="item">
          <span>物流客服：</span>
          <span v-if="traceInfo && traceInfo.express_company && traceInfo.express_company.tel">{{traceInfo.express_company.tel}}</span>
          <span v-else></span>
        </div>
      </div>
    </section>
    <section
      v-if="traceInfo && traceInfo.traces.length > 0"
      class="trace-process">
      <div
        v-for="(item, index) in traceInfo.traces"
        :key="index"
        class="row">
        <div
          class="wrapper"
          :class="{'first': index === 0, 'last': index === traceInfo.traces.length - 1}">
          <div class="content">
            <p class="time">{{item.accepted_at}}</p>
            <div>{{item.station}}</div>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import { getStore, removeStore } from '../../config/mUtils'
  export default {
    data () {
      return {
        header: '查看物流',
        token: getStore('user') ? getStore('user').authentication_token : '',
        traceInfo: null,
        logo: getStore('traceLogo')
      }
    },
    components: {
      CommonHeader
    },
    methods: {
      goBack () {
        if (getStore('Trace_goHome')) {
          removeStore('Trace_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      getTrace (id) {
        this.$store.dispatch('commonAction', {
          url: `/order_forms/${id}/traces`,
          method: 'get',
          params: {
            token: this.token
          },
          data: {},
          target: this,
          resolve: (state, res) => {
            this.traceInfo = res.data.order_forms
          },
          reject: () => {
          }
        })
      }
    },
    mounted () {
      this.getTrace(this.$route.params.id)
    },
    filters: {
      status: function (val) {
        switch (val) {
          case 'nothing':
            return '无轨迹'
          case 'courier_receipted':
            return '快递员已揽件'
          case 'on_the_way':
            return '在途中'
          case 'buyer_receipted':
            return '已签收'
          case 'issue_goods':
            return '问题件'
          default:
            return '无轨迹'
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .info {
    @include px2rem(padding-top, 88px);
    display: flex;
    align-items: center;
    background-color: $white;
    border-bottom: 1px solid $tenth-grey;
    img {
      @include px2rem(height, 130px);
      @include px2rem(width, 130px);
      @include pm2rem(margin, 22px, 44px, 22px, 36px);
    }
    img[lazy=loading] {
      @include px2rem(height, 130px);
      @include px2rem(width, 130px);
      background-position: center center!important;
      background: url("../../assets/imgLoading3.jpg");
      background-repeat: no-repeat;
      background-size: cover;
    }
    img[lazy=error] {
      @include px2rem(height, 130px);
      @include px2rem(width, 130px);
      background-position: center center!important;
      background: url("../../assets/imgLoadingError.png");
      background-repeat: no-repeat;
      background-size: cover;
    }
    img[lazy=loaded] {
      @include px2rem(height, 130px);
      @include px2rem(width, 130px);
    }
    .item {
      span {
        @include font-dpr(14px);
        color: $third-dark;
      }
      .status {
        color: $primary-dark;
      }
      .danger {
        color: #FF5001;
      }
    }
  }
  .trace-process {
    background-color: $white;
    @include px2rem(margin-top, 20px);
    border-top: 1px solid $tenth-grey;
    .row {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: auto;
      .wrapper {
        flex: 1;
        @include px2rem(margin-left, 65px);
        border-left: 1px solid $fourth-grey;
        @include px2rem(border-width, 2px);
        position: relative;
        .content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          border-bottom: 1px solid $second-grey;
          @include px2rem(margin-left, 65px);
          @include pm2rem(padding, 30px, 30px, 30px, 20px);
          color: $third-dark;
          @include font-dpr(14px);
          .time {
            @include px2rem(padding-bottom, 20px);
          }
        }
      }
      .content:after {
        content: '';
        display: inline-block;
        position: absolute;
        @include px2rem(left, -15px);
        @include px2rem(top, 36px);
        @include px2rem(width, 30px);
        @include px2rem(height, 30px);
        @include px2rem(border-radius, 30px);
        background-color: $fourth-grey;
      }
      .first {
        border-left-color: $green;
      }
      .first .content {
        color: $primary-dark;
      }
      .last .content{
        border-bottom: none;
      }
      .first .content:after {
        background-color: $green;
      }
    }
  }
</style>
