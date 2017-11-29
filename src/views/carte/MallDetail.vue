<template>
  <section>
    <div class="container full-width">
      <common-header
        :title="header"
        @back="goBack()">
      </common-header>
      <div class="container" ref="mallDetail" :style="{height: scrollHeight}">
        <div class="card-container">
          <enterprise-card
            :store="teams"
            :products="products"
            @icon-click="iconClick"
            @click="goEnterpriseDetail">
          </enterprise-card>
        </div>
        <template  v-if="loading || enterpriseInfoFiles && enterpriseInfoFiles.length > 0">
          <information-list
            key="information"
            :store="enterpriseInfoFiles"
            :num="10"
            :loading="loading"
            @click="openInformationFolders">
          </information-list>
        </template>
        <div
          v-else
          key="information1"
          class="no-data">
          <img src="../../assets/noInformation.png">
        </div>
      </div>
      <template v-if="showDialog">
        <pop-dialog
          :store="message"
          @close="closeDialog">
        </pop-dialog>
      </template>
    </div>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import EnterpriseCard from '../../components/common/EnterpriseCard'
  import PopDialog from '../../components/common/PopDialog'
  import InformationList from '../../components/common/InformationList'
  import { getStore, removeStore } from '../../config/mUtils'
  export default {
    props: ['id'],
    name: 'MallDetail',
    data () {
      return {
        header: '商城详情',
        token: getStore('user') ? getStore('user').authentication_token : '',
        hasLogin: !!getStore('user'),
        teams: null,
        products: [],
        productPageIndex: 1,
        productPageSize: 10,
        scrollHeight: '15rem',
        showDialog: false,
        loading: true,
        enterpriseInfoFiles: []
      }
    },
    components: {
      CommonHeader,
      EnterpriseCard,
      PopDialog,
      InformationList
    },
    methods: {
      iconClick (item) {
        switch (item.type) {
          case 'chat':
            if (!this.hasLogin) {
              this.goLogin()
            } else {
              this.$router.push({name: 'Chat', query: {type: 'Product', productId: item.value}})
            }
            break
          case 'email':
            this.showPopDialog(2, '邮箱地址', item.value)
            break
          case 'website':
            window.location.href = item.value.indexOf('http') > -1 ? item.value : `http://${item.value}`
            break
          case 'qq':
            this.showPopDialog(0, 'QQ号', item.value)
            break
          case 'address':
            if (item.value.latitude && item.value.longitude) {
              this.$router.push({name: 'Maps', query: {lat: item.value.latitude, lng: item.value.longitude, title: this.teams.company}})
            } else {
              this.$router.push({name: 'Maps', query: {lat: '', lng: '', title: this.teams.company, address: item.value.address}})
            }
            break
        }
      },
      goLogin () {
        this.$store.dispatch('switchIntegralDialog', {status: true})
      },
      showPopDialog (type, name, value) {
        this.message = {
          type: type,
          name: name,
          value: value
        }
        this.showDialog = true
      },
      closeDialog () {
        this.showDialog = false
      },
      goEnterpriseDetail (id) {
        if (!this.hasLogin) {
          this.goLogin()
        } else {
          this.$router.push({name: 'EnterpriseDetail', params: {id: id}})
        }
      },
      getEnterpriseDetail () {
        this.loading = true
        this.$store.dispatch('commonAction', {
          url: '/links/teams',
          method: 'get',
          params: {
            ids: this.id
          },
          target: this,
          resolve: (state, res) => {
            this.teams = res.data.teams[0]
            this.getEnterpriseDocument()
            this.getProducts()
          },
          reject: () => {
            this.loading = false
          }
        })
      },
      getProducts () {
        this.$store.dispatch('commonAction', {
          url: '/products',
          method: 'get',
          params: {
            team_id: this.id,
            page: this.productPageIndex,
            per_page: this.productPageSize
          },
          target: this,
          resolve: (state, res) => {
            this.products = res.data.products
          },
          reject: () => {
            this.loading = false
          }
        })
      },
      goBack () {
        if (getStore('MallDetail_goHome')) {
          removeStore('MallDetail_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      openInformationFolders (item) {
        this.$router.push({name: 'InformationFolders', params: {id: this.id}, query: {type: item.name || ''}})
      },
      // 获取指定组织已发布的公司档分类概况(协会名片资讯)
      getEnterpriseDocument () {
        this.$store.dispatch('commonAction', {
          url: '/archives/stat/types',
          method: 'get',
          params: {
            team_id: this.id
          },
          target: this,
          resolve: (state, res) => {
            this.enterpriseDocuments = res.data.types.filter(i => i.file_id !== null)
            this.getInformation(this.handleDocumentIds(this.enterpriseDocuments))
          },
          reject: () => {
            this.loading = false
          }
        })
      },
      handleDocumentIds (arr) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          tmpArr.push(arr[i].file_id)
        }
        return tmpArr
      },
      getInformation (ids) {
        this.$store.dispatch('commonAction', {
          url: '/links/files/publisheds',
          method: 'get',
          params: {
            type: 'document',
            team_id: this.id,
            thumbs: ['general'],
            ids: ids
          },
          target: this,
          resolve: (state, res) => {
            this.enterpriseInfoFiles = this.handleEnterpriseInfoFiles(this.enterpriseDocuments, res.data.files)
            this.loading = false
          },
          reject: () => {
            this.loading = false
          }
        })
      },
      // 手机QQ浏览器及UC浏览器不支持array.findIndex方法
      handleEnterpriseInfoFiles (enterpriseDocuments, files) {
        for (let i = 0; i < files.length; i++) {
          for (let j = 0; j < enterpriseDocuments.length; j++) {
            if (files[i].id === enterpriseDocuments[j].file_id) {
              files[i].name = enterpriseDocuments[j].name
              files[i].count = enterpriseDocuments[j].count
              switch (enterpriseDocuments[j].name) {
                case null:
                  files[i].cnname = '其他'
                  break
                case 'Certificate':
                  files[i].cnname = '社会身份'
                  break
                case 'Case':
                  files[i].cnname = '案例'
                  break
                case 'Information':
                  files[i].cnname = '资讯'
                  break
                case 'Notification':
                  files[i].cnname = '通知'
                  break
                case 'SaleCertificate':
                  files[i].cnname = '销售资质'
                  break
                default:
                  files[i].cnname = '其他'
                  break
              }
            }
          }
        }
        return files
      }
    },
    mounted () {
      let appHeight = document.getElementById('app').offsetHeight
      let rootFontSize = document.documentElement.style.fontSize.split('p')[0]
      let divHeight = (appHeight / parseFloat(rootFontSize + '')).toFixed(2)
      this.scrollHeight = `${Math.round(divHeight * 100) / 100}rem`
      this.getEnterpriseDetail(this.id)
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

</style>
