<script setup lang="ts">
import { Table } from 'ant-design-vue'
import { type TableProps } from 'ant-design-vue/es/table'
import { computed, toRaw } from 'vue'
interface PropsInterface extends TableProps {
  currentPage: number
  limit?: number
  fixedActions?: boolean
  showIndexColumn?: boolean
}
const {
  limit = 10,
  columns,
  dataSource,
  currentPage,
  fixedActions = true,
  rowSelection,
  showIndexColumn = true,
  bordered = true
} = defineProps<PropsInterface>()

const columnsC = computed<TableProps['columns']>(() => {
  const index = columns?.findIndex((item) => item.key === 'actions')
  const tempColumns = toRaw(columns)
  if (fixedActions) {
    if (index !== -1) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      tempColumns[index].fixed = 'right'
    }
  }
  const base = showIndexColumn
    ? [
        {
          title: '№',
          key: 'numberIndex',
          dataIndex: 'numberIndex',
          width: 50,
          fixed: 'left' as const,
        },
        ...tempColumns as [],
      ]
    : tempColumns

  return base
})
const dataSourceData = computed(() => {
  return dataSource?.map((item: unknown, index: number) => {
    return {
      ...(item as { numberIndex: number }),
      numberIndex: +((currentPage - 1) * limit + index + 1),
    }
  })
})
</script>

<template>
  <Table
    :pagination="false"
    :data-source="dataSourceData"
    :columns="columnsC"
    :bordered
    :row-selection="rowSelection"
    :loading
    :scroll="{ x: 'max-content' }"
  >
    <template #headerCell="{ column }">
      <slot name="headerCell" :column></slot>
    </template>
    <template #bodyCell="{ column, index, record, text, value }">
      <slot name="bodyCell" :column :index :record :text :value></slot>
    </template>
  </Table>
</template>

<style scoped>
:global(.ant-table-thead .ant-table-cell) {
  /* color: #181818 !important; */
  font-size: 14px !important;
  font-weight: 500 !important;
  line-height: 150% !important;
  text-overflow: ellipsis !important;
}

/* :global(.ant-table-wrapper .ant-table-thead > tr > th) {
  background: white;
} */

/* :global(
  :where(.css-dev-only-do-not-override-1p3hq3p).ant-table-wrapper
    .ant-table-thead
    > tr
    > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not(
      [colspan]
    )::before,
  :where(.css-dev-only-do-not-override-1p3hq3p).ant-table-wrapper
    .ant-table-thead
    > tr
    > td:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not(
      [colspan]
    )::before
) {
  background: white !important;
} */
</style>
