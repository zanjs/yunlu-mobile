<template>
  <section>
    <mt-header
      title="帮助手册"
      fixed
      class="header">
      <mt-button
        slot="left"
        @click="goBack()"
        class="button-text">
        <i class="iconfont icon-fanhui"></i>
      </mt-button>
    </mt-header>
    <div class="menu-list">
      <header>
        目录
      </header>
      <ul class="content">
        <li
          v-for="(item, index) in menus"
          :key="index"
          class="item"
          @click="goDetail(item.id)">
          {{item.value}}
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
  import { getStore, removeStore } from '../../config/mUtils'
  export default {
    data () {
      return {
        menus: [
          {
            id: '001',
            name: 'topic-001.html',
            value: '1. 如何在云库中上传图片？'
          }, {
            id: '002',
            name: 'topic-002.html',
            value: '2. 如何编辑图片？'
          }, {
            id: '003',
            name: 'topic-003.html',
            value: '3. 如何分类图片？'
          }, {
            id: '004',
            name: 'topic-004.html',
            value: '4. 如何同步通讯录？'
          }, {
            id: '005',
            name: 'topic-005.html',
            value: '5. 如何申请添加联系人？'
          }, {
            id: '006',
            name: 'topic-006.html',
            value: '6. 如何处理互换名片请求？'
          }, {
            id: '007',
            name: 'topic-007.html',
            value: '7. 如何设置防骚扰？'
          }, {
            id: '008',
            name: 'topic-008.html',
            value: '8. 如何还原黑名单中的联系人？'
          }, {
            id: '009',
            name: 'topic-009.html',
            value: '9. 如何给联系人添加标签？'
          }, {
            id: '010',
            name: 'topic-0010.html',
            value: '10. 如何给联系人添加备忘？'
          }, {
            id: '011',
            name: 'topic-011.html',
            value: '11. 如何给联系人换名片？'
          }, {
            id: '012',
            name: 'topic-012.html',
            value: '12. 如何处理收到的名片？'
          }, {
            id: '013',
            name: 'topic-013.html',
            value: '13. 如何查看联系人空间？'
          }, {
            id: '014',
            name: 'topic-014.html',
            value: '14. 如何给联系人留言？'
          }, {
            id: '015',
            name: 'topic-015.html',
            value: '15. 如何查看留言？'
          }, {
            id: '016',
            name: 'topic-016.html',
            value: '16. 如何与联系人联系？'
          }, {
            id: '017',
            name: 'topic-017.html',
            value: '17. 如何创建私人空间？'
          }, {
            id: '018',
            name: 'topic-018.html',
            value: '18. 如何创建私人空间的文件夹？'
          }, {
            id: '019',
            name: 'topic-019.html',
            value: '19. 如何在文件夹内部上传图片？'
          }, {
            id: '020',
            name: 'topic-020.html',
            value: '20. 如何编辑私人空间？'
          }, {
            id: '021',
            name: 'topic-021.html',
            value: '21. 如何编辑文件夹？'
          }, {
            id: '022',
            name: 'topic-022.html',
            value: '22. 如何编辑图片标签？'
          }, {
            id: '023',
            name: 'topic-023.html',
            value: '23. 如何对文件夹中的图片进行排序？'
          }, {
            id: '024',
            name: 'topic-024.html',
            value: '24. 如何给私人空间添加客户？'
          }, {
            id: '025',
            name: 'topic-025.html',
            value: '25. 如何删除空间中的客户？'
          }, {
            id: '026',
            name: 'topic-026.html',
            value: '26. 如何分享名片？'
          }, {
            id: '027',
            name: 'topic-027.html',
            value: '27. 如何添加外部名片到云庐名片夹中？'
          }, {
            id: '028',
            name: 'topic-028.html',
            value: '28. 如何处理名片夹中的名片？'
          }, {
            id: '029',
            name: 'topic-029.html',
            value: '29. 如何开启企业服务？'
          }, {
            id: '030',
            name: 'topic-0030.html',
            value: '30. 如何发布产品？'
          }, {
            id: '031',
            name: 'topic-031.html',
            value: '31. 如何添加员工？'
          }, {
            id: '032',
            name: 'topic-032.html',
            value: '32. 如何给员工分配职位？'
          }, {
            id: '033',
            name: 'topic-033.html',
            value: '33. 如何添加公司档？'
          }, {
            id: '034',
            name: 'topic-034.html',
            value: '34. 如何搜索已上架产品？'
          }, {
            id: '035',
            name: 'topic-035.html',
            value: '35. 如何更换头像？'
          }, {
            id: '036',
            name: 'topic-036.html',
            value: '36. 如何编辑基本资料？'
          }, {
            id: '037',
            name: 'topic-037.html',
            value: '37. 如何修改密码？'
          }, {
            id: '038',
            name: 'topic-038.html',
            value: '38. 如何清理缓存？'
          }, {
            id: '039',
            name: 'topic-039.html',
            value: '39. 如何反馈意见？'
          }, {
            id: '040',
            name: 'topic-040.html',
            value: '40. 如何退出登陆？'
          }
        ]
      }
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
      goDetail (id) {
        this.$router.push({path: `/helps/${id}`})
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
  .menu-list {
    background-color: $white;
    @include px2rem(padding-top, 88px);
    header {
      @include px2rem(height, 100px);
      @include font-dpr(20px);
      @include px2rem(padding-left, 30px);
      @include px2rem(line-height, 100px);
    }
    .content {
      .item {
        @include px2rem(height, 68px);
        @include pm2rem(padding, 0px, 0px, 0px, 30px);
        @include px2rem(line-height, 68px);
        @include font-dpr(16px);
      }
      li:active {
        background-color: rgba(239, 234, 234, .5);
      }
    }
  }
</style>

