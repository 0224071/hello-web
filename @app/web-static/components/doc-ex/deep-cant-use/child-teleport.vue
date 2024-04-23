<script setup lang="ts">
const isShow = defineModel<boolean>('isShow', {
  required: true,
})
</script>

<template>
  <Teleport to="body">
    <div v-show="isShow" class="content demo-content">
      子元件
      <button class="demo-button" @click="isShow = false">
        點我關閉
      </button>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.content {
  color: red;
}
.demo-content {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 99999999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 400px;
  height: 400px;
  font-size: 30px;
  background: #bbb;
  transform: translate(-50%, -50%);
}

.demo-button {
  padding: 5px 10px;
  margin-top: 10px;
  color: rgb(255 255 245 / 86%);
  cursor: pointer;
  background: #32363f;

  &:hover {
    background: color.adjust(#32363f, $lightness: 10%);
  }
}
</style>
