<template>
  <section>
    <common-header
      v-if="from"
      :title="header"
      rightText="官网"
      @right-click="goHomePage()"
      @back="goBack()">
    </common-header>
    <section class="tab-bar full-width" :class="{'has-header': from}">
      <a class="item" :class="{'active': activeIndex === 0}" @click="selectTab(0)">
        <span>推荐功能</span>
        <div class="border"></div>
      </a>
      <a class="item" :class="{'active': activeIndex === 1}" @click="selectTab(1)">
        <span>用户手册</span>
        <div class="border"></div>
      </a>
      <a class="item" :class="{'active': activeIndex === 2}" @click="selectTab(2)">
        <span>常见问题</span>
        <div class="border"></div>
      </a>
    </section>
    <section
      class="tab-container"
      :class="{'has-header-container': from}"
      ref="help"
      :style="{height: scrollHeight}">
      <transition name="fade" mode="out-in">
        <div v-if="activeIndex === 0" class="menu-list" key="one">
          <a
            v-for="(item, index) in recommendMenus"
            :key="index"
            class="item"
            @click="goDetail(item)">
            <span>
              {{item.name}}
            </span>
            <i class="iconfont icon-you"></i>
          </a>
        </div>
        <div v-if="activeIndex === 1" class="menu-list" key="two">
          <a
            v-for="(item, index) in docMenus"
            :key="index"
            class="item"
            @click="goDetail(item)">
            <span>
              {{item.name}}
            </span>
            <i class="iconfont icon-you"></i>
          </a>
        </div>
        <div v-if="activeIndex === 2" class="menu-list" key="three">
          <a
            v-for="(item, index) in questionMenus"
            :key="index"
            class="item"
            @click="goDetail(item)">
            <span>
              {{item.name}}
            </span>
            <i class="iconfont icon-you"></i>
          </a>
        </div>
      </transition>
    </section>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import { getStore, removeStore, setScrollTop, showBack } from '../../config/mUtils'
  export default {
    name: 'Help',
    data () {
      return {
        header: '帮助手册',
        from: this.$route.query.from || '',
        activeIndex: 0,
        scrollHeight: '15rem',
        recommendMenus: [
          {
            name: '1. 数字名片',
            value: 'topic-001.html',
            url: 'recommend'
          }, {
            name: '2. 导购赚钱(个人)',
            value: 'topic-002.html',
            url: 'recommend'
          }, {
            name: '3. 自助电商(企业)',
            value: 'topic-003.html',
            url: 'recommend'
          }
        ],
        docMenus: [
          {
            name: '1. 主控设备如何授权辅设备登录？',
            value: 'topic-001.html',
            url: 'helpdocs'
          }, {
            name: '2. 如何将辅设备申请为主控设备？',
            value: 'topic-002.html',
            url: 'helpdocs'
          }, {
            name: '3. 如何在云库中上传图片？',
            value: 'topic-003.html',
            url: 'helpdocs'
          }, {
            name: '4. 如何编辑图片？',
            value: 'topic-004.html',
            url: 'helpdocs'
          }, {
            name: '5. 如何分类图片？',
            value: 'topic-005.html',
            url: 'helpdocs'
          }, {
            name: '6. 如何同步通讯录？',
            value: 'topic-006.html',
            url: 'helpdocs'
          }, {
            name: '7. 如何申请添加联系人？',
            value: 'topic-007.html',
            url: 'helpdocs'
          }, {
            name: '8. 如何处理互换名片请求？',
            value: 'topic-008.html',
            url: 'helpdocs'
          }, {
            name: '9. 如何还原黑名单中的联系人？',
            value: 'topic-009.html',
            url: 'helpdocs'
          }, {
            name: '10. 如何给联系人添加标签？',
            value: 'topic-010.html',
            url: 'helpdocs'
          }, {
            name: '11. 如何给联系人添加备忘？',
            value: 'topic-011.html',
            url: 'helpdocs'
          }, {
            name: '12. 如何给联系人换名片？',
            value: 'topic-012.html',
            url: 'helpdocs'
          }, {
            name: '13. 如何查看联系人空间？',
            value: 'topic-013.html',
            url: 'helpdocs'
          }, {
            name: '14. 如何给联系人留言？',
            value: 'topic-014.html',
            url: 'helpdocs'
          }, {
            name: '15. 如何查看留言？',
            value: 'topic-015.html',
            url: 'helpdocs'
          }, {
            name: '16. 如何与联系人联系？',
            value: 'topic-016.html',
            url: 'helpdocs'
          }, {
            name: '17. 如何创建私人空间？',
            value: 'topic-017.html',
            url: 'helpdocs'
          }, {
            name: '18. 如何创建私人空间的文件夹？',
            value: 'topic-018.html',
            url: 'helpdocs'
          }, {
            name: '19. 如何在文件夹内部上传图片？',
            value: 'topic-019.html',
            url: 'helpdocs'
          }, {
            name: '20. 如何编辑私人空间？',
            value: 'topic-020.html',
            url: 'helpdocs'
          }, {
            name: '21. 如何编辑文件夹？',
            value: 'topic-021.html',
            url: 'helpdocs'
          }, {
            name: '22. 如何对文件夹中的图片进行排序？',
            value: 'topic-022.html',
            url: 'helpdocs'
          }, {
            name: '23. 如何给私人空间添加客户？',
            value: 'topic-023.html',
            url: 'helpdocs'
          }, {
            name: '24. 如何删除空间中的客户？',
            value: 'topic-024.html',
            url: 'helpdocs'
          }, {
            name: '25. 如何分享名片？',
            value: 'topic-025.html',
            url: 'helpdocs'
          }, {
            name: '26. 如何处理名片夹中的名片？',
            value: 'topic-026.html',
            url: 'helpdocs'
          }, {
            name: '27. 如何发布产品？',
            value: 'topic-027.html',
            url: 'helpdocs'
          }, {
            name: '28. 如何在企业空间中结算成本？',
            value: 'topic-028.html',
            url: 'helpdocs'
          }, {
            name: '29. 如何将企业中的资金转出？',
            value: 'topic-029.html',
            url: 'helpdocs'
          }, {
            name: '30. 如何添加员工？',
            value: 'topic-030.html',
            url: 'helpdocs'
          }, {
            name: '31. 如何给员工分配职位？',
            value: 'topic-031.html',
            url: 'helpdocs'
          }, {
            name: '32. 如何申请导购员？',
            value: 'topic-032.html',
            url: 'helpdocs'
          }, {
            name: '33. 如何聘用导购员？',
            value: 'topic-033.html',
            url: 'helpdocs'
          }, {
            name: '34. 如何添加公司资讯？',
            value: 'topic-034.html',
            url: 'helpdocs'
          }, {
            name: '35. 如何搜索已上架产品？',
            value: 'topic-035.html',
            url: 'helpdocs'
          }, {
            name: '36. 如何更换头像？',
            value: 'topic-036.html',
            url: 'helpdocs'
          }, {
            name: '37. 如何编辑基本资料？',
            value: 'topic-037.html',
            url: 'helpdocs'
          }, {
            name: '38. 如何修改密码？',
            value: 'topic-038.html',
            url: 'helpdocs'
          }, {
            name: '39. 如何清理缓存？',
            value: 'topic-039.html',
            url: 'helpdocs'
          }, {
            name: '40. 如何反馈意见？',
            value: 'topic-040.html',
            url: 'helpdocs'
          }, {
            name: '41. 如何退出登录？',
            value: 'topic-041.html',
            url: 'helpdocs'
          }
        ],
        questionMenus: [
          {
            name: '1. 注意',
            value: 'topic-001.html',
            url: encodeURIComponent('Q&A')
          }, {
            name: '2. 下载、安装App问题',
            value: 'topic-002.html',
            url: encodeURIComponent('Q&A')
          }, {
            name: '3. 云视',
            value: 'topic-003.html',
            url: encodeURIComponent('Q&A')
          }, {
            name: '4. 云库',
            value: 'topic-004.html',
            url: encodeURIComponent('Q&A')
          }, {
            name: '5. 人脉',
            value: 'topic-005.html',
            url: encodeURIComponent('Q&A')
          }, {
            name: '6. 空间',
            value: 'topic-006.html',
            url: encodeURIComponent('Q&A')
          }
        ]
      }
    },
    components: {
      CommonHeader
    },
    methods: {
      goBack () {
        if (getStore('Help_goHome')) {
          removeStore('Help_goHome')
          this.$router.replace({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      selectTab (index) {
        this.activeIndex = index
      },
      goDetail (item) {
        this.$router.push({path: `/helps/${item.value}?url=${item.url}&from=${this.$route.query.from || ''}`})
      },
      goHomePage () {
        window.location.href = 'https://www.yunlu6.com'
      },
      // 解决iOS设备:active伪类不生效的bug，给元素或其容器添加touchstart的空监听
      handleActive () {
        showBack(status => {}, 0, this.$refs.help)
      },
      handleScrollHeight () {
        let appHeight = document.getElementById('app').offsetHeight
        let rootFontSize = document.documentElement.style.fontSize.split('p')[0]
        let divHeight = (appHeight / parseFloat(rootFontSize + '')).toFixed(2)
        this.scrollHeight = `${Math.round(divHeight * 100) / 100}rem`
      }
    },
    mounted () {
      this.handleScrollHeight()
      this.handleActive()
    },
    activated () {
      if (!this.$store.state.popState) {
        setScrollTop(0, this.$refs.help)
      } else {
        setScrollTop(this.$store.state.scrollMap.Help || 0, this.$refs.help)
      }
    },
    beforeRouteLeave (to, from, next) {
      this.$store.dispatch('saveScroll', {name: 'Help', value: this.$refs.help.scrollTop})
      if (to.name !== 'HelpDetail') {
        this.activeIndex = 0
      }
      next()
    }
  }
</script>

<style lang="scss" scoped>
   @import '../../styles/mixin';

  .tab-bar {
    position: fixed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    top: 0;
    @include pm2rem(padding, 0px, 60px, 0px, 60px);
    background-color: $white;
    box-sizing: border-box;
    border-bottom: 1px solid $tenth-grey;
    z-index: 2;
    .item {
      position: relative;
      @include px2rem(height, 98px);
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      span {
        @include font-dpr(16px);
        color: $primary-dark;
        transition: color .2s;
      }
      .border {
        position: absolute;
        bottom: 0;
        @include px2rem(height, 8px);
        transition: background-color .2s;
        width: 100%;
        left: 0;
        right: 0;
      }
    }
    .active {
      span {
        color: $green;
      }
      .border {
        background-color: $green;
      }
    }
  }
  .has-header {
    @include px2rem(top, 88px);
  }
  .tab-container {
    @include px2rem(padding-top, 112px);
    box-sizing: border-box;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    margin-bottom: 1px;
    z-index: 1;
    .menu-list {
      a:active {
        background-color: rgba(239, 234, 234, .5);
      }
      .item {
        @include px2rem(height, 98px);
        background-color: $white;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex: 1;
        @include pm2rem(padding, 0px, 30px, 0px, 30px);
        border-bottom: 1px solid $second-grey;
        cursor: pointer;
        box-sizing: border-box;
        span {
          @include font-dpr(16px);
          color: $second-dark;
          line-height: normal;
        }
        i {
          @include font-dpr(20px);
          color: $third-dark;
        }
      }
      & a:first-child {
        border-top: 1px solid $second-grey;
      }
    }
  }
  .has-header-container {
    @include px2rem(padding-top, 200px);
  }
</style>

