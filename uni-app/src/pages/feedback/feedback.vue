<template>
  <view class="feedback">
    <view class="feedback-title">
      <text>问题和意见</text>
      <text class="feedback-quick" @tap="chooseMsg">快速键入</text>
    </view>
    <view class="feedback-body">
      <textarea placeholder="请详细描述你的问题和意见..." v-model="sendDate.content" class="feedback-textarea"></textarea>
    </view>

    <view class="feedback-title"><text>图片(选填,提供问题截图,图片大小2M以下)</text></view>
    <view class="feedback-body feedback-uploader">
      <wt-images-uploader v-model="imageList" :max-count="9" isAsync :over-size="2048" auto-upload uploadPath="feedback" />
      <!-- <view class="uni-uploader">
        <view class="uni-uploader-head">
          <view class="uni-uploader-title">点击预览图片</view>
          <view class="uni-uploader-info">{{ imageList.length }}/5</view>
        </view>
        <view class="uni-uploader-body">
          <view class="uni-uploader__files">
            <block v-for="(image, index) in imageList" :key="index">
              <view class="uni-uploader__file" style="position: relative">
                <image class="uni-uploader__img" :src="image" @tap="previewImage(index)"></image>
                <view class="close-view" @click="close(index)">x</view>
              </view>
            </block>
            <view class="uni-uploader__input-box" v-show="imageList.length < 5"
              ><view class="uni-uploader__input" @tap="chooseImg"></view
            ></view>
          </view>
        </view>
      </view> -->
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      imageList: [],
      sendDate: {
        score: 0,
        content: '',
        contact: '',
      },
    };
  },
  methods: {
    chooseMsg() {},
  },
};
</script>

<style lang="scss" scoped>
.feedback {
  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;
    color: #8f8f94;
    font-size: 28rpx;
  }
  &-quick {
    position: relative;
    padding-right: 40rpx;
    &:after {
      font-family: uniicons;
      font-size: 40rpx;
      content: '\e581';
      position: absolute;
      right: 0;
      top: 50%;
      color: #bbb;
      transform: translateY(-50%);
    }
  }
  &-body {
    background: #fff;
  }
  &-textarea {
    height: 200rpx;
    font-size: 34rpx;
    line-height: 50rpx;
    width: 100%;
    box-sizing: border-box;
    padding: 20rpx 30rpx 0;
  }
  &-uploader {
    padding: 22rpx 20rpx;
  }
}
</style>
