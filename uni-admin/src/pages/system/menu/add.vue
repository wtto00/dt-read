<template>
	<view class="uni-container">
		<uni-forms labelWidth="80" ref="form" v-model="formData" :rules="rules" validateTrigger="bind" @submit="submit">
			<uni-forms-item name="menu_id" label="标识" required>
				<uni-easyinput v-model="formData.menu_id" :clearable="false" placeholder="请输入菜单项的ID，不可重复" />
			</uni-forms-item>
			<uni-forms-item name="name" label="名称" required>
				<uni-easyinput v-model="formData.name" :clearable="false" placeholder="请输入菜单名称" />
			</uni-forms-item>
			<uni-forms-item name="icon" label="图标" style="margin-bottom: 40px;">
				<uni-easyinput v-model="formData.icon" :clearable="false" placeholder="请输入菜单图标" />
				<uni-link font-size="12" href="https://uniapp.dcloud.net.cn/uniCloud/admin?id=icon-%e5%9b%be%e6%a0%87" text="如何获取内置图标或使用自定义图标？"
				 class="uni-form-item-tips"></uni-link>
			</uni-forms-item>
			<uni-forms-item name="url" label="URL">
				<uni-easyinput v-model="formData.url" :clearable="false" placeholder="请输入菜单url" />
			</uni-forms-item>
			<uni-forms-item name="sort" label="序号">
				<uni-easyinput v-model="formData.sort" :clearable="false" placeholder="请输入菜单序号（越大越靠后）" />
			</uni-forms-item>
			<uni-forms-item name="parent_id" label="父菜单标识">
				<uni-easyinput v-model="formData.parent_id" :clearable="false" placeholder="请输入父级菜单标识, 一级菜单不需要填写" />
			</uni-forms-item>
			<uni-forms-item name="permission" label="权限列表" style="margin-bottom: 60px;">
				<uni-data-checkbox :multiple="true" v-model="formData.permission" collection="uni-id-permissions" field="permission_name as text, permission_id as value" />
				<view class="uni-form-item-tips">
					当用户拥有以上被选中的权限时，可以访问此菜单，建议仅对子菜单配置权限，父菜单会自动包含。
				</view>
			</uni-forms-item>
			<uni-forms-item name="enable" label="是否启用">
				<switch @change="binddata('enable', $event.detail.value)" :checked="formData.enable" />
			</uni-forms-item>
			<view class="uni-button-group">
				<button style="width: 100px;" type="primary" class="uni-button" @click="submitForm">提交</button>
				<navigator open-type="navigateBack" style="margin-left: 15px;"><button style="width: 100px;" class="uni-button">返回</button></navigator>
			</view>
		</uni-forms>
	</view>
</template>

<script>
	import validator from '@/js_sdk/validator/opendb-admin-menus.js';

	const db = uniCloud.database();
	const dbCmd = db.command;
	const dbCollectionName = 'opendb-admin-menus';

	function getValidator(fields) {
		let reuslt = {}
		for (let key in validator) {
			if (fields.includes(key)) {
				reuslt[key] = validator[key]
			}
		}
		return reuslt
	}

	export default {
		data() {
			return {
				formData: {
					"menu_id": "",
					"name": "",
					"icon": "",
					"url": "",
					"sort": null,
					"parent_id": "",
					"permission": [],
					"enable": true
				},
				rules: {
					...getValidator(["menu_id", "name", "icon", "url", "sort", "parent_id", "permission", "enable"])
				}
			}
		},
		methods: {
			/**
			 * 触发表单提交
			 */
			submitForm() {
				this.$refs.form.submit();
			},

			/**
			 * 表单提交
			 * @param {Object} event 回调参数 Function(callback:{value,errors})
			 */
			submit(event) {
				const {
					value,
					errors
				} = event.detail

				// 表单校验失败页面会提示报错 ，要停止表单提交逻辑
				if (errors) {
					return
				}
				uni.showLoading({
					title: '提交中...',
					mask: true
				})
				this.$request('system/menu/add', value).then((res) => {
					uni.showToast({
						title: '新增成功'
					})
					this.getOpenerEventChannel().emit('refreshData')
					setTimeout(() => uni.navigateBack(), 500)
				}).finally(() => {
					uni.hideLoading()
				})
			}
		}
	}
</script>
