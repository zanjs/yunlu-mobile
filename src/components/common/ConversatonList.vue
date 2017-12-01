<template>
  <section>
    <div class="list-wrapper">
      <div
        v-for="(item, index) in store"
        :key="index"
        class="row-item">
        <div
          class="check-box"
          @click="handleChecked(item)">
          <i
            v-if="item.checked"
            class="iconfont icon-xuanzhong checked"></i>
          <i
            v-if="!item.checked"
            class="iconfont icon-weixuanzhong"></i>
        </div>
        <div
          class="container"
          @click="handleClick(item)">
          <img
            v-if="item.logoUrl"
            :src="item.logoUrl">
          <img
            v-else
            src="../../assets/userAvatarSmall.png">
          <div
            v-if="!item.hasRead"
            class="dot"></div>
          <div class="content-wraper">
            <div class="content">
              <div class="top">
                <div class="name">
                  {{item.remark}}
                </div>
                <div class="date">{{item.timestamp | dateFilter}}</div>
              </div>
              <div class="msg">
                {{item.lastMessage}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import moment from 'moment'
  export default {
    data () {
      return {

      }
    },
    props: ['store'],
    methods: {
      handleClick (item) {
        this.$emit('click', item)
      },
      handleChecked (item) {
        this.$emit('check', item)
      }
    },
    filters: {
      dateFilter (str) {
        let today = moment(new Date()).format('YYYY-MM-DD')
        let day = moment(str).format('YYYY-MM-DD')
        return moment(day).isSame(today, 'day') ? moment(str).format('HH:mm:ss') : day
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .list-wrapper {
    background-color: $white;
    box-sizing: border-box;
    .row-item {
      display: flex;
      align-items: center;
      @include px2rem(height, 140px);
      border-bottom: 1px solid $third-grey;
      .check-box {
        @include px2rem(width, 74);
        @include px2rem(padding-left, 28px);
        height: inherit;
        display: flex;
        align-items: center;
        i {
          @include font-dpr(21px);
          color: $fifth-grey;
        }
        .checked {
          color: $green;
        }
      }
      .container {
        flex: 1;
        display: flex;
        align-items: center;
        height: inherit;
        position: relative;
        img {
          @include px2rem(width, 118px);
          @include px2rem(height, 118px);
          @include px2rem(border-radius, 59px);
          @include px2rem(margin-right, 30px);
        }
        .dot {
          position: absolute;
          @include px2rem(top, 12px);
          @include px2rem(left, 110px);
          background-color: $red;
          @include px2rem(width, 18px);
          @include px2rem(height, 18px);
          @include px2rem(border-radius, 9px);
        }
        .content-wraper {
          display: block;
          height: inherit;
          @include px2rem(padding-right, 32px);
          flex: 1;
          .content {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            line-height: 1;
            height: inherit;
            width: 100%;
            .top {
              display: flex;
              justify-content: space-between;
              align-items: center;
              width: 100%;
              .name {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                @include font-dpr(16px);
                color: $second-dark;
                @include px2rem(width, 260px);
              }
              .date {
                @include font-dpr(14px);
                color: $third-dark;
                @include px2rem(width, 200px);
                text-align: right;
              }
            }
            .msg {
              @include font-dpr(14px);
              color: $third-dark;
            }
          }
        }
      }
    }
  }
</style>
