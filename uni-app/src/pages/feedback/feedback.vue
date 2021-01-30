<template>
  <view class="container tui-padding">
    <view class="tui-title">问题和意见</view>
    <view class="tui-textarea-box">
      <textarea
        class="tui-textarea"
        v-model="sendDate.content"
        placeholder="请详细描述你的问题和意见..."
        maxlength="500"
        placeholder-class="tui-phcolor-color"
      />
      <view class="tui-textarea-counter">0/500</view>
    </view>

    <view class="tui-title">图片(选填,提供问题截图,图片大小2M以下)</view>
    <view class="tui-upload-box">
      <wt-images-uploader
        v-model="imageList"
        columNum="4"
        :max-count="9"
        :over-size="2048"
        isAsync
        uploadPath="feedback"
      />
    </view>

    <view class="tui-title">QQ/邮箱</view>
    <view class="tui-input-border">
      <input
        class="tui-input"
        v-model="sendDate.contact"
        placeholder="选填,方便我们联系你"
        placeholder-class="tui-phcolor"
      />
    </view>

    <view class="tui-title">应用评分</view>
    <tui-rate :size="30" :current="sendDate.score" @change="({ index }) => (sendDate.score = index)"></tui-rate>

    <view class="tui-title">
      <tui-button type="primary" :disabled="disabled" @tap="send">提交</tui-button>
    </view>
  </view>
</template>

<script>
import { getPlatform } from '@/static/js/util';

export default {
  data() {
    return {
      imageList: [],
      sendDate: {
        platform: getPlatform(),
        score: 0,
        content: '',
        contact: '',
      },
    };
  },
  computed: {
    disabled() {
      const { content } = this.sendDate;
      if (!content.trim()) return true;
      return false;
    },
  },
  onLoad() {
    uni.getSystemInfo({
      success: (res) => {
        // 平台
        this.sendDate.p = res.platform;
        // 设备型号
        this.sendDate.md = res.model;
        // 系统
        this.sendDate.os = res.system;
      },
    });
  },
  methods: {
    send() {
      console.log('send');
      uni.showLoading({ title: '加载中' });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 30rpx 0 80rpx 0;
  box-sizing: border-box;
  overflow: hidden;
}
.tui-padding {
  padding: 0 30rpx;
  box-sizing: border-box;
  overflow: hidden;
}
.tui-title {
  padding: 30rpx 0;
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
}
.tui-top40 {
  margin-top: 40rpx;
}
.tui-pl-30 {
  padding-left: 30rpx;
}
.feedback-submit {
  margin-top: 30rpx;
}
</style>
