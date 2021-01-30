<template>
  <view class="wt-images-uploader">
    <view
      class="wt-images-uploader-item"
      :class="`column${columNum}`"
      :style="itemStyle"
      v-for="(img, index) in images"
      :key="img.key"
    >
      <image class="placeholder-image" src="./1px.png" mode="widthFix" />
      <image
        class="wt-images-uploader-item-body"
        :mode="imgMode"
        :src="img.file ? img.file.path : img.url"
        @click="tapImg(index)"
      />
      <view class="loading-mask" v-if="uploadingMask === 'imgMask' && loading[img.key]">
        <tui-icon class="loading-spinner" color="#eee" :size="30" name="loading"></tui-icon>
      </view>
      <tui-icon class="delete-icon" color="#f00" :name="delBtn.icon" :style="delBtn.style" @click="removeImg(index)"></tui-icon>
    </view>
    <view
      v-if="mode === 'upload' && images.length < maxCount"
      class="wt-images-uploader-item"
      :class="`column${columNum}`"
      :style="itemStyle"
    >
      <image class="placeholder-image" src="./1px.png" mode="widthFix" />
      <view class="wt-images-uploader-item-body">
        <slot name="select-button">
          <view class="select-button" hover-class="tui-opcity" :style="selectBtn.btnSty" @click="selectImg">
            <tui-icon class="select-button-icon" color="#000" :name="selectBtn.icon" :style="selectBtn.iconSty"></tui-icon>
            <text class="select-button-text" :style="selectBtn.textSty">{{ selectBtn.text }}</text>
          </view>
        </slot>
      </view>
    </view>

    <tui-modal
      v-if="uploadingMask === 'dialogList'"
      custom
      :show="showUploadingModal"
      width="90%"
      :maskClosable="false"
      @cancel="showUploadingModal = false"
    >
      <view class="loading-popup-title">图片上传中...</view>
      <view class="loading-popup-row" v-for="(img, index) in uploadingImages" :key="img.key">
        <text class="loading-popup-row-label">第{{ index + 1 }}张</text>
        <progress class="loading-popup-row-progress" :percent="progress[img.key]" show-info activeColor="#6cc" />
      </view>
    </tui-modal>

    <tui-tips ref="popupMessage"></tui-tips>
  </view>
</template>

<script>
import tuiModal from '../tui-modal/tui-modal.vue';
const trimPath = (path) => {
  const trimedPath = path.replace(/^\/+|\/+$/g, '');
  return trimedPath ? `/${trimedPath}` : '';
};

export default {
  components: { tuiModal },
  name: 'wt-images-uploader',
  props: {
    // 组件模式:upload上传 show展示
    mode: {
      type: String,
      default: 'upload',
      validator: (value) => ['upload', 'show'].indexOf(value) !== -1,
    },
    // 最大上传数量
    maxCount: { type: [Number, String], default: 9 },
    // 列数 每行显示几个图片 支持1-5列
    columNum: { type: [Number, String], default: 3 },
    // 单张图片大小限制  0不限制 单位KB
    overSize: { type: [Number, String], default: 0 },
    // 图片间隔
    spaceBetween: { type: [Number, String], default: 10 },
    // 否开启自动上传
    autoUpload: { type: Boolean, default: false },
    // 多图传入图片url数组
    value: { type: Array, default: () => [] },
    // 图片显示模式  aspectFill 默认值
    imgMode: { type: String, default: 'aspectFill' },
    // 是否异步上传 默认false为同步
    isAsync: { type: Boolean, default: false },
    // 点击图片触发操作 none不做任何操作  preview浏览图片 replace替换图片
    tapModel: {
      type: String,
      default: 'none',
      validator: (value) => ['none', 'preview', 'replace'].indexOf(value) !== -1,
    },
    // 上传时遮罩模式  imgMask图片遮罩   uniLoading uniapp的loading  dialogList模态框列表
    uploadingMask: {
      type: String,
      default: 'uniLoading',
      validator: (value) => ['imgMask', 'uniLoading', 'dialogList'].indexOf(value) !== -1,
    },
    // 图片显示样式
    imgStyle: { type: Object, default: () => ({}) },
    // 上传按钮设置
    selectBtn: {
      type: Object,
      default: () => ({
        text: '上传图片',
        textSty: null,
        icon: 'plus',
        iconSty: null,
        btnSty: null,
      }),
    },
    // 图片删除按钮样式
    delBtn: {
      type: Object,
      default: () => ({
        icon: 'close-fill',
        style: {},
      }),
    },
    // 上传文件所在路径 前后不要加'/'
    uploadPath: { type: String, default: '' },
  },
  data() {
    return {
      showUploadingModal: false,
      uploadingImages: [],
      loading: {},
      progress: {},
      message: '',
    };
  },
  computed: {
    itemStyle() {
      return {
        width: `calc(${100 / this.columNum}% - ${(this.spaceBetween * (this.columNum - 1)) / this.columNum}px)`,
        marginRight: `${this.spaceBetween}px`,
        marginBottom: `${this.spaceBetween}px`,
      };
    },
    images: {
      get() {
        return this.value.map((item) => {
          return typeof item === 'string' ? { url: item, key: Math.random() } : item;
        });
      },
      set(val) {
        this.$emit('input', val);
      },
    },
    overSizeUnit() {
      if (this.overSize < 1024) return this.overSize + 'KB';
      return this.overSize / 1024 + 'MB';
    },
  },
  methods: {
    selectImg({ success, count = this.maxCount - this.images.length }) {
      uni.chooseImage({
        count,
        success: (res) => {
          let files = [];
          const overSize = Number(this.overSize) * 1024;
          let count = 0;
          res.tempFiles.forEach((item) => {
            if (!overSize || (overSize && item.size <= overSize)) {
              files.push({
                file: item,
                key: Math.random(),
              });
            } else if (overSize && item.size > overSize) {
              // 超过大小
              count += 1;
            }
          });
          if (count > 0) {
            this.$refs.popupMessage.showTips({
              type: 'warning',
              msg: '图片不能超过' + this.overSizeUnit,
            });
          }
          if (success) {
            success(files);
          } else {
            this.images.push(...files);
            this.$forceUpdate();
            if (this.autoUpload) this.uploadImgs(files);
          }
        },
        fail: () => {
          uni.showToast({ title: '选择图片出错了' });
        },
      });
    },
    uploadImgs(files = this.images) {
      this.uploadingImages = files.filter((item) => !item.url);
      if (this.uploadingImages.length === 0) return;
      this.showLoading();
      let count = 0;
      const errors = [];
      if (this.isAsync) {
        // 异步
        this.uploadingImages.forEach((file) => {
          this.uploadImg(file)
            .then(() => {})
            .catch(() => {
              errors.push(file.key);
            })
            .finally(() => {
              count += 1;
              if (count === this.uploadingImages.length) {
                // 上传完毕
                this.hideLoading();
                if (errors.length > 0) {
                  // 有上传失败的
                  uni.showToast({ title: `${errors.length}张图片上传失败` });
                  // 上传失败自动删除已选择的文件
                  this.removeImgs(errors);
                }
              }
            });
        });
      } else {
        // 同步
        this.uploadImgsSync(files, count, errors);
      }
    },
    async uploadImgsSync(files, count, errors) {
      // 同步上传
      this.uploadImg(files[count])
        .then(() => {})
        .catch(() => {
          errors.push(file.key);
        })
        .finally(() => {
          if (count + 1 === files.length) {
            // 上传完毕
            this.hideLoading();
            if (errors.length > 0) {
              // 有上传失败的
              uni.showToast({ title: `${errors.length}张图片上传失败` });
              // 上传失败自动删除已选择的文件
              this.removeImgs(errors);
            }
          } else {
            this.uploadImgsSync(files, count + 1, errors);
          }
        });
    },
    uploadImg({ file, key }) {
      // 文档 https://uniapp.dcloud.io/uniCloud/storage?id=uploadfile
      return new Promise((resolve, reject) => {
        this.setLoading(key, true);
        uniCloud
          .uploadFile({
            filePath: file.path,
            cloudPath: `${trimPath(this.uploadPath)}/${file.name}`,
            fileType: 'image',
            onUploadProgress: (progressEvent) => {
              this.$set(this.progress, key, Math.round((progressEvent.loaded * 100) / progressEvent.total));
            },
          })
          .then((res) => {
            if (res.success) {
              const index = this.images.findIndex((img) => img.key === key);
              if (index > -1) {
                this.images[index].url = res.fileID;
              }
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch((res) => {
            reject(res);
          })
          .finally(() => {
            this.setLoading(key, false);
          });
      });
    },
    showLoading() {
      if (this.uploadingMask === 'uniLoading') {
        uni.showLoading({ title: '正在上传...' });
      } else if (this.uploadingMask === 'dialogList') {
        this.showUploadingModal = true;
        // this.$refs.loadingDialog.open();
      }
    },
    hideLoading() {
      if (this.uploadingMask === 'uniLoading') {
        uni.hideLoading();
      } else if (this.uploadingMask === 'dialogList') {
        this.showUploadingModal = false;
        // this.$refs.loadingDialog.close();
      }
    },
    setLoading(key, loading = false) {
      if (this.uploadingMask === 'imgMask' || this.uploadingMask === 'dialogList') {
        this.$set(this.loading, key, loading);
      }
    },
    tapImg(index) {
      if (this.tapModel === 'preview') {
        uni.previewImage({
          current: index,
          urls: this.images.map((item) => (item.file ? item.file.path : item.url)),
        });
      } else if (this.tapModel === 'replace') {
        this.selectImg({
          count: 1,
          success: (files) => {
            this.$set(this.images, index, files[0]);
            if (this.autoUpload) this.uploadImgs(files);
          },
        });
      }
    },
    removeImg(index) {
      this.images.splice(index, 1);
      this.$forceUpdate();
    },
    removeImgs(keys) {
      this.images = this.images.filter((img) => !keys.includes(img.key));
      this.$forceUpdate();
    },
  },
};
</script>

<style lang="scss" scoped>
.placeholder-image {
  width: 100%;
}
.wt-images-uploader {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  &-item {
    position: relative;
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
    .loading-mask {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(#000, 0.6);
      .loading-spinner {
        animation: rotate 3s linear infinite;
      }
    }
    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    .delete-icon {
      position: absolute;
      font-size: 36rpx;
      top: -18rpx;
      right: -18rpx;
    }
    &.column1 {
      &:nth-of-type(n) {
        margin-right: 0 !important;
      }
    }
    &.column2 {
      &:nth-of-type(2n) {
        margin-right: 0 !important;
      }
    }
    &.column3 {
      &:nth-of-type(3n) {
        margin-right: 0 !important;
      }
    }
    &.column4 {
      &:nth-of-type(4n) {
        margin-right: 0 !important;
      }
    }
    &.column5 {
      &:nth-of-type(5n) {
        margin-right: 0 !important;
      }
    }
  }
  .loading-popup {
    width: 90vw;
    background-color: #fff;
    border-radius: 10rpx;
    padding: 20rpx;
    &-title {
      font-weight: bold;
      margin-bottom: 10rpx;
    }
    &-row {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;
      &-label {
        margin-right: 20rpx;
        font-size: 30rpx;
      }
      &-progress {
        flex: 1;
      }
    }
  }
}
</style>
