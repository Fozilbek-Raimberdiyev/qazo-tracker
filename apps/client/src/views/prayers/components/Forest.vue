<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

interface Prayer {
  name: string;
  date: string;
  dayNumber: number;
  completed: boolean;
  x: number;
  y: number;
}

interface TooltipData {
  show: boolean;
  x: number;
  y: number;
  name: string;
  date: string;
  dayNumber: number;
  completed: boolean;
}

interface Position {
  x: number;
  y: number;
}

const prayerData = ref<Prayer[]>([]);
const forestContainer = ref<HTMLElement | null>(null);
const containerWidth = ref(1200);
const containerHeight = ref(700);
const tooltip = ref<TooltipData>({
  show: false,
  x: 0,
  y: 0,
  name: '',
  date: '',
  dayNumber: 0,
  completed: false
});

const namozlar: string[] = ['Bomdod', 'Peshin', 'Asr', 'Shom', 'Xufton'];

// Ma'lumotlarni yaratish
const initializePrayerData = (): Omit<Prayer, 'x' | 'y'>[] => {
  const data: Omit<Prayer, 'x' | 'y'>[] = [];
  let completedCount = 0;
  const targetCompleted = 50;
  const today = new Date();

  for (let day = 0; day < 30; day++) {
    for (let i = 0; i < 5; i++) {
      const prayerDate = new Date(today);
      prayerDate.setDate(today.getDate() - (29 - day));

      const isCompleted = completedCount < targetCompleted;
      if (isCompleted) completedCount++;

      data.push({
        name: namozlar[i] as string,
        date: prayerDate.toLocaleDateString('uz-UZ', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        dayNumber: day + 1,
        completed: isCompleted
      });
    }
  }

  return data;
};

// Tabiiy o'rmon joylashuvi - butun container bo'ylab
const getNaturalForestPosition = (
  index: number,
  total: number,
  containerWidth: number,
  containerHeight: number,
  existingPositions: Position[]
): Position => {
  const treeWidth = 40;
  const treeHeight = 45;
  const padding = 30;
  const minDistance = 42;

  let attempts = 0;
  let x: number, y: number;

  do {
    if (attempts < 50) {
      // Grid asosida joylashtirish - har yerga teng taqsimlash
      const cols = 16;
      const rows = Math.ceil(total / cols);

      const col = index % cols;
      const row = Math.floor(index / cols);

      const cellWidth = (containerWidth - padding * 2) / cols;
      const cellHeight = (containerHeight - padding * 2) / rows;

      // Har bir cell markazidan tasodifiy offset
      const baseX = padding + col * cellWidth + cellWidth / 2;
      const baseY = padding + row * cellHeight + cellHeight / 2;

      const randomX = (Math.random() - 0.5) * (cellWidth * 0.7);
      const randomY = (Math.random() - 0.5) * (cellHeight * 0.7);

      x = baseX + randomX;
      y = baseY + randomY;
    } else {
      // Fallback: to'liq tasodifiy
      x = padding + Math.random() * (containerWidth - padding * 2 - treeWidth);
      y = padding + Math.random() * (containerHeight - padding * 2 - treeHeight);
    }

    // Chegaralarni tekshirish
    x = Math.max(padding, Math.min(x, containerWidth - treeWidth - padding));
    y = Math.max(padding, Math.min(y, containerHeight - treeHeight - padding));

    // Minimal masofani tekshirish
    let tooClose = false;
    for (const pos of existingPositions) {
      const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      if (distance < minDistance) {
        tooClose = true;
        break;
      }
    }

    if (!tooClose) break;
    attempts++;
  } while (attempts < 150);

  return { x, y };
};

// Daraxtlarni pozitsiya bilan yaratish
const generateTreesWithPositions = (): Prayer[] => {
  const data = initializePrayerData();
  const containerWidth = 1200;
  const containerHeight = 700;
  const existingPositions: Position[] = [];

  return data.map((prayer, index) => {
    const pos = getNaturalForestPosition(
      index,
      data.length,
      containerWidth,
      containerHeight,
      existingPositions
    );
    existingPositions.push(pos);

    return {
      ...prayer,
      x: pos.x,
      y: pos.y
    };
  });
};

// Tooltip ko'rsatish
const showTooltip = (e: MouseEvent, prayer: Prayer): void => {
  tooltip.value = {
    show: true,
    x: e.clientX + 15,
    y: e.clientY + 15,
    name: prayer.name,
    date: prayer.date,
    dayNumber: prayer.dayNumber,
    completed: prayer.completed
  };
};

// Tooltip harakati
const moveTooltip = (e: MouseEvent): void => {
  if (tooltip.value.show) {
    tooltip.value.x = e.clientX + 15;
    tooltip.value.y = e.clientY + 15;
  }
};

// Tooltip yashirish
const hideTooltip = (): void => {
  tooltip.value.show = false;
};

// Container o'lchamlarini yangilash
const updateContainerSize = () => {
  if (forestContainer.value) {
    containerWidth.value = forestContainer.value.clientWidth;
    containerHeight.value = forestContainer.value.clientHeight;
    prayerData.value = generateTreesWithPositions();
  }
};

onMounted(() => {
  // Container yuklanganidan keyin o'lchamlarni olish
  setTimeout(() => {
    updateContainerSize();
  }, 10);

  // Window resize event listener
  window.addEventListener('resize', updateContainerSize);
});

// Cleanup
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateContainerSize);
});
</script>

<template>
  <div class="container">
    <div class="forest-container" ref="forestContainer">
      <div
        v-for="(prayer, index) in prayerData"
        :key="index"
        class="tree"
        :style="{ left: prayer.x + 'px', top: prayer.y + 'px' }"
        @mouseenter="(e) => showTooltip(e, prayer)"
        @mousemove="moveTooltip"
        @mouseleave="hideTooltip"
      >
        <!-- Yashil daraxt -->
        <svg v-if="prayer.completed" viewBox="0 0 28 60" xmlns="http://www.w3.org/2000/svg">
          <rect x="11" y="40" width="6" height="20" fill="#8B4513"/>
          <circle cx="14" cy="32" r="10" fill="#2ecc71"/>
          <circle cx="14" cy="25" r="9" fill="#27ae60"/>
          <circle cx="14" cy="18" r="8" fill="#2ecc71"/>
          <circle cx="9" cy="28" r="6" fill="#27ae60"/>
          <circle cx="19" cy="28" r="6" fill="#27ae60"/>
        </svg>

        <!-- Sariq daraxt -->
        <svg v-else viewBox="0 0 28 60" xmlns="http://www.w3.org/2000/svg">
          <rect x="11" y="40" width="6" height="20" fill="#8B4513"/>
          <circle cx="14" cy="32" r="10" fill="#f39c12"/>
          <circle cx="14" cy="25" r="9" fill="#f1c40f"/>
          <circle cx="14" cy="18" r="8" fill="#f39c12"/>
          <circle cx="9" cy="28" r="6" fill="#f1c40f"/>
          <circle cx="19" cy="28" r="6" fill="#f1c40f"/>
        </svg>
      </div>
    </div>

    <!-- Tooltip -->
    <div
      v-if="tooltip.show"
      class="tooltip"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    >
      <div class="prayer-name">{{ tooltip.name }}</div>
      <div class="prayer-date">{{ tooltip.dayNumber }}-kun • {{ tooltip.date }}</div>
      <div :class="['prayer-status', tooltip.completed ? 'completed' : 'remaining']">
        {{ tooltip.completed ? '✓ Bajarilgan' : '✗ Bajarilmagan' }}
      </div>
    </div>
  </div>
</template>

<style scoped>


.forest-container {
  position: relative;
  width: 100%;
  height: 700px;

}

/* Responsive heights */
@media (max-width: 1536px) {
  .forest-container {
    height: 650px;
  }
}

@media (max-width: 1280px) {
  .forest-container {
    height: 600px;
  }
}

@media (max-width: 1024px) {
  .forest-container {
    height: 550px;
  }
}

@media (max-width: 768px) {
  .forest-container {
    height: 500px;
  }
}

@media (max-width: 640px) {
  .forest-container {
    height: 450px;
  }
}

.tree {
  position: absolute;
  cursor: pointer;
  transition: transform 0.3s ease, filter 0.3s ease;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2));
  width: 55px;
  height: 60px;
}

.tree:hover {
  transform: scale(1.4);
  filter: drop-shadow(4px 4px 10px rgba(0, 0, 0, 0.5));
  z-index: 100;
}

.tree svg {
  width: 100%;
  height: 100%;
}

.tooltip {
  position: fixed;
  background: var(--color-primary);
  color: white;
  padding: 15px 20px;
  border-radius: 10px;
  pointer-events: none;
  z-index: 1000;
  max-width: 300px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
}

.prayer-name {
  font-size: 1.3em;
  font-weight: bold;
  margin-bottom: 8px;
  color: #fff;
}

.prayer-date {
  font-size: 1em;
  color: #ccc;
  margin-bottom: 5px;
}

.prayer-status {
  font-size: 1.1em;
  font-weight: bold;
  margin-top: 8px;
}

.prayer-status.completed {
  color: #2ecc71;
}

.prayer-status.remaining {
  color: #e74c3c;
}
</style>
