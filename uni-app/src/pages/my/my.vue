<template>
  <view class="container">
    <view class="head" style="background-image:url(../../static/images/my/mine_bg.png)">
      <image v-if="hasLogin && userInfo.avatar" class="avatar" :src="userInfo.avatar" />
      <image v-else class="avatar" src="@/static/images/my/mine_def_touxiang_3x.png" />
      <view class="user-name">{{ showUserName }}</view>
    </view>

    <view class="middle">
      <view class="middle-item" hover-class="tui-opcity" :hover-stay-time="150" @click="previewReward">
        <image class="middle-item-img" src="@/static/images/my/reward.png" />
        <text class="middle-item-label">赞赏</text>
      </view>
      <view class="middle-item" hover-class="tui-opcity" :hover-stay-time="150" @click="goFeedback">
        <!-- #ifdef APP-PLUS || MP-WEIXIN || MP-QQ -->
        <button open-type="feedback" class="middle-item-feedback"></button>
        <!-- #endif -->
        <image class="middle-item-img" src="@/static/images/my/feedback.png" />
        <text class="middle-item-label">反馈</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(['hasLogin', 'userInfo']),
    showUserName() {
      if (!this.hasLogin) return '点击前去登录';
      return this.userInfo.name || this.userInfo.email;
    },
  },
  methods: {
    previewReward() {
      uni.previewImage({
        urls: ['https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dt-read/dabc7300-5d8c-11eb-bdc1-8bd33eb6adaa.png'],
      });
    },
    goFeedback() {
      // #ifndef APP-PLUS || MP-WEIXIN || MP-QQ
      uni.navigateTo({
        url: '/pages/feedback/feedback',
      });
      // #endif
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  .head {
    height: 440rpx;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .avatar {
      width: 160rpx;
      height: 160rpx;
    }
    .user-name {
      font-size: 28rpx;
      color: #fefefe;
      margin-top: 20rpx;
    }
  }
  .middle {
    height: 138rpx;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    border-radius: 10rpx;
    background-color: #fff;
    margin: -30rpx 30rpx 26rpx;
    box-shadow: 0 15rpx 10rpx -15rpx #efefef;
    &-item {
      height: 100%;
      display: flex;
      align-items: center;
      position: relative;
      &-img {
        width: 80rpx;
        height: 80rpx;
      }
      &-label {
        font-size: 28rpx;
        color: #333;
        font-weight: bold;
        margin-left: 22rpx;
      }
      &-feedback {
        background: transparent !important;
        position: absolute;
        height: 100%;
        width: 100%;
        left: 0;
        top: 0;
        &::after {
          display: none;
        }
      }
    }
  }
}
</style>
