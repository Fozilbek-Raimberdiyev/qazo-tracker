<script setup lang="ts">
import BaseButton from '@/components/BaseButton/BaseButton.vue'
import { Dropdown, Menu, MenuItem } from 'ant-design-vue'
interface Props {
  viewMode: 'dropdown' | 'button'
}

const emit = defineEmits(['add', 'download', 'mark', 'stats'])
defineProps<Props>()
</script>

<template>
  <Dropdown trigger="click" v-if="viewMode==='dropdown'">
    <button class="cursor-pointer">
      <span class="material-symbols-outlined"> more_horiz </span>
    </button>
    <template #overlay>
      <Menu>
        <MenuItem>
          <BaseButton @click="emit('add')" size="small" type="ghost">
            <template #icon>
              <span class="material-symbols-outlined mr-1 align-top">add</span>
            </template>
            Yangi qo'shish
          </BaseButton>
        </MenuItem>
        <MenuItem>
          <BaseButton type="ghost" size="small" @click="emit('download')">
            <template #icon>
              <span class="material-symbols-outlined mr-1 align-top">download</span>

            </template>Yuklab olish
          </BaseButton>
        </MenuItem>
        <MenuItem>
          <BaseButton @click="emit('mark')" type="ghost" size="small">
            <template #icon>
              <span class="material-symbols-outlined mr-1 align-top">check_circle</span>
            </template>
            Belgilash
          </BaseButton>
        </MenuItem>
      </Menu>
    </template>
  </Dropdown>
  <div v-else-if="viewMode==='button'" class="flex items-center gap-1  flex-wrap">
    <BaseButton @click="emit('add')" size="large" type="default">
      <template #icon>
        <span class="material-symbols-outlined mr-1 align-top">add</span>
      </template>
      Yangi qo'shish
    </BaseButton>
    <BaseButton type="default" size="large" @click="emit('download')">
      <template #icon>
        <span class="material-symbols-outlined mr-1 align-top">download</span>

      </template> Yuklab olish
    </BaseButton>
    <BaseButton @click="emit('mark')" type="default" size="large">
      <template #icon>
        <span class="material-symbols-outlined mr-1 align-top">check_circle</span>
      </template>
      Belgilash
    </BaseButton>
    <BaseButton @click="emit('stats')" type="default" size="large">
      <template #icon>
        <span class="material-symbols-outlined mr-1 align-top">insights</span>
      </template>
      Oylik statistika
    </BaseButton>
  </div>
</template>
