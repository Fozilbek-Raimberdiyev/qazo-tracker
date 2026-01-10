<template>
  <Layout class="layout">
    <!-- Header (mobile uchun fixed top bar) -->
    <LayoutHeader class="header">
      <div class="header-left">
        <menu-unfold-outlined class="trigger" @click="drawerVisible = true" />
        <h2 style="color: white; margin: 0 16px">Qazo Tracker</h2>
      </div>
      <div class="header-right">
        <Button type="text" shape="circle" style="color: white">
          <calendar-outlined />
        </Button>
        <Button type="text" shape="circle" style="color: white">
          <ellipsis-outlined />
        </Button>
      </div>
    </LayoutHeader>

    <!-- Asosiy content -->
    <LayoutContent class="content">
      <div class="page-title">
        <h1>Qazo namozlar</h1>
        <p>Qazo namozlaringizni ko'ring va ularni o'zgartiring</p>
      </div>

      <!-- Oy taqvimi -->
      <Card class="calendar-card">
        <Calendar v-model:value="calendarValue" fullscreen @select="onDateSelect">
          <template #dateCellRender="{ current }">
            <div class="namoz-day">
              <div class="day-number">{{ current.date() }}</div>
              <ul class="namoz-list">
                <li><sunny-outlined class="bomdod" /> Bomdod</li>
                <li><sun-outlined class="peshin" /> Peshin</li>
                <li><cloud-outlined class="asr" /> Asr</li>
                <li><moon-outlined class="shom" /> Shom</li>
                <li><fire-outlined class="xufton" /> Xufton</li>
                <li><fire-outlined class="vitr" /> Vitr</li>
              </ul>
            </div>
          </template>
          <template #headerRender="{ value }">
            <div class="calendar-header">
              <left-outlined @click="prevMonth" />
              <span>{{ value?.format('MMMM YYYY') }}</span>
              <right-outlined @click="nextMonth" />
            </div>
          </template>
        </Calendar>
      </Card>

      <!-- Oylik samaradorlik -->
      <Card class="stats-card">
        <h3>Oylik samaradorlik</h3>
        <Progress type="circle" :percent="0" :width="120" strokeColor="#ff4d4f">
          <template #format>
            <div>
              <div style="font-size: 24px">0%</div>
              <div style="font-size: 12px; color: #999">O'qilgan: 0</div>
              <div style="font-size: 12px; color: #ff4d4f">Qoldiq: 186</div>
            </div>
          </template>
        </Progress>
        <div class="total">Jami namozlar: 186</div>
      </Card>

      <!-- Namoz turlari statistikasi -->
      <Card class="prayer-stats">
        <h3>Namoz turlari</h3>
        <List item-layout="horizontal">
          <ListItem>
            <ListItemMeta title="Bomdod" />
            <template #extra>0%</template>
          </ListItem>
          <ListItem>
            <ListItemMeta title="Peshin" />
            <template #extra>0%</template>
          </ListItem>
          <ListItem>
            <ListItemMeta title="Asr" />
            <template #extra>0%</template>
          </ListItem>
          <ListItem>
            <ListItemMeta title="Shom" />
            <template #extra>0%</template>
          </ListItem>
          <ListItem>
            <ListItemMeta title="Xufton" />
            <template #extra>0%</template>
          </ListItem>
          <ListItem>
            <ListItemMeta title="Vitr" />
            <template #extra>0%</template>
          </ListItem>
        </List>
      </Card>
    </LayoutContent>

    <!-- Sidebar Drawer (mobile uchun) -->
    <Drawer
      title="Menyu"
      placement="left"
      :visible="drawerVisible"
      @close="drawerVisible = false"
      :width="280"
    >
      <Menu mode="inline" :selected-keys="['qazo-namozlar']">
        <MenuItem key="dashboard">
          <dashboard-outlined />
          Dashboard
        </MenuItem>
        <MenuItem key="qazo-namozlar">
          <clock-circle-outlined />
          Qazo namozlar
        </MenuItem>
        <MenuItem key="settings">
          <setting-outlined />
          Sozlamalar
        </MenuItem>
      </Menu>
      <div class="user-info">
        <Avatar :size="64" icon="user-outlined" />
        <p>Nilufar Raimberdiyeva</p>
        <p>nilufar@gmail.com</p>
      </div>
    </Drawer>
  </Layout>
</template>

<script setup>
import { ref } from 'vue'
import {
  MenuUnfoldOutlined,
  CalendarOutlined,
  EllipsisOutlined,
  LeftOutlined,
  RightOutlined,
  CloudOutlined,
  FireOutlined,
  DashboardOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons-vue'
import {
  Layout,
  LayoutHeader,
  LayoutContent,
  Card,
  Calendar,
  Progress,
  List,
  Drawer,
  Menu,
  Button,
  Avatar,
  ListItem,
  ListItemMeta,
  MenuItem,
} from 'ant-design-vue'

const drawerVisible = ref(false)
const calendarValue = ref(null)

const prevMonth = () => {
  /* logic */
}
const nextMonth = () => {
  /* logic */
}
const onDateSelect = (date) => {
  console.log('Tanlangan kun:', date)
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
  background: #f5f5f5;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #001529;
  padding: 0 16px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
}
.header-left {
  display: flex;
  align-items: center;
}
.trigger {
  font-size: 20px;
  color: white;
  cursor: pointer;
}
.content {
  padding: 70px 16px 16px;
}
.page-title {
  text-align: center;
  margin-bottom: 24px;
}
.calendar-card {
  margin-bottom: 24px;
}
.namoz-day {
  text-align: center;
}
.day-number {
  font-weight: bold;
  margin-bottom: 8px;
}
.namoz-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 12px;
}
.namoz-list li {
  margin: 4px 0;
}
.stats-card {
  text-align: center;
  margin-bottom: 24px;
}
.total {
  margin-top: 16px;
  font-size: 16px;
}
.prayer-stats {
  margin-bottom: 80px;
}
.user-info {
  position: absolute;
  bottom: 24px;
  text-align: center;
  width: 100%;
  left: 0;
  padding: 0 24px;
}
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}
</style>
