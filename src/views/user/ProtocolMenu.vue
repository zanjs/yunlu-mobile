<template>
  <section>
    <common-header
      :title="header"
      @back="goBack()">
    </common-header>
    <div class="menu-list">
      <ul class="content">
        <li
          v-for="(item, index) in menus"
          :key="index"
          class="flex item white-bg"
          @click="goDetail(item.value)">
          {{item.name}}
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import { getStore, removeStore } from '../../config/mUtils'
  export default {
    name: 'ProtocolMenu',
    data () {
      return {
        header: '使用条款和隐私政策',
        menus: [
          {
            name: '云庐注册协议',
            value: 'signup_protocol.html'
          }, {
            name: '云庐服务协议',
            value: 'service_protocol.html'
          }, {
            name: '云庐企业服务使用协议',
            value: 'shopping_guide_protocol.html'
          }, {
            name: '云庐软件许可使用协议',
            value: 'soft_protocol.html'
          }, {
            name: '云庐法律声明及隐私政策',
            value: 'legal_statement.html'
          }, {
            name: '云庐用户管理规范',
            value: 'user_rule.html'
          }, {
            name: '云庐积分规则',
            value: 'service_protocol.html'
          }
        ]
      }
    },
    components: {
      CommonHeader
    },
    methods: {
      goBack () {
        if (getStore('ProtocolMenu_goHome')) {
          removeStore('ProtocolMenu_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      goDetail (item) {
        this.$router.push({name: 'Protocol', query: {name: item}})
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .menu-list {
    @include px2rem(padding-top, 88px);
    .content {
      .item {
        @include px2rem(height, 80px);
        @include pm2rem(padding, 0px, 0px, 0px, 30px);
        line-height: normal;
        @include font-dpr(16px);
        justify-content: flex-start;
        border-bottom: 1px solid $second-grey;
      }
      li:active {
        background-color: rgba(239, 234, 234, .5);
      }
    }
  }
</style>


