<template>
  <section>
    <common-header
      :title="header"
      :icon-class="iconClass"
      :right-text="rightBtnText"
      @right-click="goHome()"
      @back="goBack()">
    </common-header>
    <div class="container">
      <div class="detail-container white-bg">
        <div class="name-info font-15">
          <p
            v-if="comityDetail && comityDetail.name"
            class="primary-text">{{comityDetail.name}}</p>
          <p
            v-else
            class="primary-text">胖胖的云庐君</p>
          <div
            class="rate third-text"
            v-if="comityDetail.organization && comityDetail.organization.state">
            <i
              v-for="(item, index) in starLevelComputed"
              :key="index"
              :class="{'selected': item.selected}"
              class="iconfont icon-icon-test1"></i>
          </div>
          <template v-if="comityDetail.organization && comityDetail.organization.state  && comityDetail.organization.state === 'approved'">
            <div class="level">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-zhenshi4"></use>
              </svg>
            </div>
          </template>
          <template v-if="comityDetail.organization && comityDetail.organization.state  && comityDetail.organization.state !== 'approved'">
            <div class="level">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-zhenshi3"></use>
              </svg>
            </div>
          </template>
        </div>
        <div
          v-if="comityDetail && comityDetail.enttype"
          class="item">
          <span class="label">机构状态</span>
          <span class="content">{{comityDetail.enttype}}</span>
        </div>
        <div
          v-if="comityDetail && comityDetail.legal_person"
          class="item">
          <span class="label">法定代表人</span>
          <span class="content">{{comityDetail.legal_person}}</span>
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
          v-if="comityDetail && comityDetail.reg_no"
          class="item">
          <span class="label">机构代码</span>
          <span class="content">{{comityDetail.reg_no}}</span>
        </div>
        <div
          v-if="comityDetail && comityDetail.id_no"
          class="item">
          <span class="label">信用代码</span>
          <span class="content">{{comityDetail.id_no}}</span>
        </div>
        <div
          v-if="comityDetail && comityDetail.organization &&  comityDetail.organization.guild_organizations && comityDetail.organization.guild_organizations.length > 0"
          class="link-container font-14">
          <div class="label">{{comityDetail && comityDetail.organization && comityDetail.organization.service && comityDetail.organization.service.aliaz === 'mall' ? '运营主体' : '社会认证'}}</div>
          <div class="link-item flex-1">
            <div
              v-for="(item, index) in comityDetail.organization.guild_organizations"
              :key="index"
              class="link flex-1">
              <a
                class="flex-between row"
                @click="goCarte(item)">
                <span>{{item.name}}</span>
                <i class="iconfont icon-fanhui primary font-15"></i>
              </a>
            </div>
          </div>
        </div>
        <div
          v-if="comityDetail && comityDetail.organization && comityDetail.organization.service && comityDetail.organization.service.aliaz === 'mall'"
          class="item">
          <span class="label">有效期</span>
          <span class="content">
            从{{comityDetail.organization.from}}至{{comityDetail.organization.to}}止
          </span>
        </div>
      </div>
    </div>
    <div
      v-if="!(comityDetail.enttype || comityDetail.legal_person || comityDetail.info_id  ||comityDetail.address || comityDetail.reg_org || comityDetail.reg_no || comityDetail.id_no) && (comityDetail.organization && comityDetail.organization.guild_organizations && comityDetail.organization.guild_organizations.length === 0)">
      <div class="no-data">
        <img src="../../assets/noFile.png">
      </div>
    </div>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import { getStore, removeStore } from '../../config/mUtils'
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        header: '资信',
        iconClass: 'icon-zhuye',
        rightBtnText: '',
        token: getStore('user') ? getStore('user').authentication_token : '',
        teamId: this.$route.params.id,
        starLevel: []
      }
    },
    components: {
      CommonHeader
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
            if (res.data.enterprises.organization && res.data.enterprises.organization.state) {
              if (res.data.enterprises.organization.state === 'approved') {
                for (let i = 0; i < 5; i++) {
                  this.starLevel.push({index: i, selected: i < 3})
                }
              } else {
                for (let i = 0; i < 5; i++) {
                  this.starLevel.push({index: i, selected: false})
                }
              }
            }
          },
          reject: () => {
          }
        })
      },
      goBack () {
        if (getStore('EnterpriseDetail_goHome')) {
          removeStore('EnterpriseDetail_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      goCarte (item) {
        if (item.service_name === '班级') {
          this.$router.push({name: 'Class', params: {id: item.id}})
        } else if (item.service_name === '协会') {
          this.$router.push({name: 'ComityCarte', params: {id: item.id}})
        } else if (item.service_name === '校友会') {
          this.$router.push({name: 'Alumni', params: {id: item.id}})
        } else if (item.service_name === '商家') {
          this.$router.push({name: 'Mall', params: {id: item.id}})
        } else {
          this.$router.push({name: 'EnterpriseCarte', params: {id: item.id}})
        }
      },
      goHome () {
        this.$router.push({name: 'See'})
      }
    },
    mounted () {
      this.getEnterpriseDetail()
    },
    computed: {
      ...mapGetters([
        'comityDetail'
      ]),
      starLevelComputed: function () {
        return this.starLevel.sort((a, b) => a.index - b.index)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .container {
    @include px2rem(padding-top, 88px);
  }
  .detail-container {
    @include pm2rem(margin, 20px, 30px, 0px, 30px);
    @include pm2rem(padding, 38px, 22px, 0px, 22px);
    .name-info {
      @include px2rem(padding-bottom, 18px);
      line-height: 1;
      .rate {
        @include pm2rem(margin, 32px, 0px, 22px, 0px);
        i {
          @include px2rem(margin-right, 12px);
        }
        .selected {
          color: #F7D14E;
        }
      }
      .level {
        @include font-dpr(23px);
      }
    }
    .item {
      border-top: 1px dashed $fifth-grey;
      @include font-dpr(14px);
      @include px2rem(line-height, 78px);
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .label {
        @include px2rem(width, 186px);
        display: block;
      }
      .content {
        flex: 1;
      }
    }
    .link-container {
      border-top: 1px dashed $fifth-grey;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .label {
        @include px2rem(width, 186px);
      }
      .link-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        .link {
          .row {
            align-items: center;
            @include pm2rem(padding, 20px, 0px, 20px, 0px);
          }
          i {
            transform: rotateY(180deg);
          }
          a {
            text-decoration: none;
          }
          a:active {
            background-color: $tenth-grey;
          }
        }
      }
    }
  }
</style>
