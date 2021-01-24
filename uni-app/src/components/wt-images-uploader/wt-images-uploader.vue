<template>
  <view class="wt-images-uploader">
    <view
      class="wt-images-uploader-item"
      :class="`column${columNum}`"
      :style="{ paddingRight: `${spaceBetween}px`, marginBottom: `${spaceBetween}px` }"
      v-for="img in images"
      :key="img.key"
    >
      <image class="placeholder-image" src="./1px.png" mode="widthFix" />
      <image
        class="wt-images-uploader-item-body"
        :mode="imgMode"
        :src="img.file ? img.file.path : img.url"
        :style="{ paddingRight: `${spaceBetween}px`, ...imgStyle }"
      />
    </view>
    <view
      v-if="mode === 'upload' && images.length < maxCount"
      class="wt-images-uploader-item"
      :class="`column${columNum}`"
      :style="{ paddingRight: `${spaceBetween}px`, marginBottom: `${spaceBetween}px` }"
    >
      <image class="placeholder-image" src="./1px.png" mode="widthFix" />
      <view class="wt-images-uploader-item-body" :style="{ paddingRight: `${spaceBetween}px` }">
        <slot name="select-button">
          <view class="select-button" hover-class="opcity" :style="selectBtn.btnSty" @click="selectImg">
            <uni-icons class="select-button-icon" :type="selectBtn.icon" :style="selectBtn.iconSty" />
            <text class="select-button-text" :style="selectBtn.textSty">{{ selectBtn.text }}</text>
          </view>
        </slot>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'wt-images-uploader',
  props: {
    // 组件模式:upload上传 show展示
    mode: {
      type: String,
      default: 'upload',
      validator: (value) => ['upload', 'show'].indexOf(value) !== -1
    },
    // 最大上传数量
    maxCount: { type: [Number, String], default: 9 },
    // 列数 每行显示几个图片
    columNum: { type: [Number, String], default: 3 },
    // 单张图片大小限制  0不限制 单位KB
    overSize: { type: [Number, String], default: 0 },
    // 图片间隔
    spaceBetween: { type: [Number, String], default: 10 },
    // 否开启自动上传
    autoUpload: { type: Boolean, default: false },
    // 多图传入图片url数组
    imgList: { type: Array, default: () => [] },
    // 图片显示模式  aspectFill 默认值
    imgMode: { type: String, default: 'aspectFill' },
    // 是否异步上传 默认false为同步
    isAsync: { type: Boolean, default: false },
    // 点击图片触发操作 none不做任何操作  preview浏览图片 replace替换图片
    tapModel: {
      type: String,
      default: 'none',
      validator: (value) => ['none', 'preview', 'replace'].indexOf(value) !== -1
    },
    // 上传时遮罩模式  imgMask图片遮罩   uniLoading uniapp的loading  dialogList模态框列表 
    uploadingMask: {
      type: String,
      default: 'uniLoading',
      validator: (value) => ['imgMask', 'uniLoading', 'dialogList'].indexOf(value) !== -1
    },
    // 图片显示样式
    imgStyle: { type: Object, default: () => ({}) },
    // 上传按钮设置
    selectBtn: {
      type: Object,
      default: () => ({
        text: '上传图片',
        textSty: null,
        icon: 'plusempty',
        iconSty: null,
        btnSty: null
      })
    },
    // 图片删除按钮样式
    delBtn: {
      type: Object,
      default: () => ({
        icon: 'icon-roundclosefill',
        style: { top: '-20rpx' }
      })
    },
    // 上传文件所在路径 前后不要加'/'
    uploadPath: { type: String, default: '' }
  },
  data() {
    const images = this.imgList.map(item => ({ url: item, key: Math.random() }));
    return {
      images,
      loading: images.reduce((sum, item) => ({ ...sum, [item.key]: false }), {}),
    }
  },
  methods: {
    selectImg() {
      uni.chooseImage({
        count: this.maxCount - this.images.length,
        success: res => {
          let files = [];
          const overSize = Number(this.overSize) * 1024
          res.tempFiles.forEach(item => {
            if (!overSize || (overSize && item.size < overSize)) {
              files.push({
                file: item,
                key: Math.random(),
              })
            }
          })
          this.images.push(...files)
          if (this.autoUpload) this.uploadImgs(files)
        },
        fail: () => {
          uni.showToast({ title: '选择图片出错了' })
        }
      })
    },
    uploadImgs(files = this.images) {
      const waitUploadImages = files.files(item => !item.url)
    },
    showLoading(key) {
      if (this.uploadingMask === 'uniLoading') {
        if (this.isAsync) {
          // 异步
          uni.showLoading({ title: '正在上传' })
        } else {
          // 同步
          const img = this.images.find(item => item.key === key)
          if (img) {
            uni.showLoading({ title: '正在上传' + img.file.name })
          } else {
            uni.showLoading({ title: '正在上传' })
          }
        }
      } else if (this.uploadingMask === 'imgMask') {
        const img = this.images.find(item => item.key === key)
        if (img) {
          this.loading[img.key] = true
        }
      } else if (this.uploadingMask === 'dialogList') { }
    },
  }
}
</script>

<style lang="scss" scoped>
.placeholder-image {
  width: 100%;
}
.wt-images-uploader {
  display: flex;
  flex-wrap: wrap;
  &-item {
    width: 0;
    max-width: 33.33%;
    flex: 1;
    position: relative;
    box-sizing: border-box;
    &-body {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      box-sizing: border-box;
      .select-button {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 1px solid #e9e9e9;
        &-icon {
          font-size: 60rpx;
        }
        &-text {
          font-size: 28rpx;
        }
      }
    }
  }
}
</style>