<script setup lang="ts">

</script>

<template>
  <div class="">
<!-- PageHeading -->
<div class="flex flex-wrap items-center justify-between gap-4 mb-8">
<div class="flex min-w-72 flex-col gap-2">
<p class="text-3xl font-black leading-tight tracking-[-0.033em] text-slate-900 dark:text-white">Welcome back, User!</p>
<p class="text-base font-normal leading-normal text-slate-600 dark:text-slate-400">Here's a summary of your Qaza prayer progress.</p>
</div>
<button class="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity">
<span class="material-symbols-outlined text-lg">add</span>
<span class="truncate">Log Prayer</span>
</button>
</div>
<!-- Stats -->
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
<div class="flex flex-1 flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5">
<p class="text-base font-medium leading-normal text-slate-600 dark:text-slate-400">Total Qaza Remaining</p>
<p class="text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">1,204</p>
</div>
<div class="flex flex-1 flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5">
<p class="text-base font-medium leading-normal text-slate-600 dark:text-slate-400">Completed This Month</p>
<p class="text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">88</p>
</div>
<div class="flex flex-1 flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5">
<p class="text-base font-medium leading-normal text-slate-600 dark:text-slate-400">Daily Average</p>
<p class="text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">2.9</p>
</div>
</div>
<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
<div class="lg:col-span-2">
<!-- Progress Bar Section -->
<div class="rounded-xl border border-slate-200 dark:border-white/10 p-6 bg-white dark:bg-white/5 mb-8">
<h2 class="text-lg font-bold leading-tight tracking-[-0.015em] text-slate-900 dark:text-white mb-4">Overall Progress</h2>
<div class="flex flex-col gap-3">
<div class="flex justify-between gap-6">
<p class="text-base font-medium leading-normal text-slate-600 dark:text-slate-400">Completion Progress</p>
<p class="text-sm font-bold leading-normal text-slate-900 dark:text-white">35%</p>
</div>
<div class="w-full rounded-full bg-slate-200 dark:bg-slate-700">
<div class="h-2 rounded-full bg-primary" style="width: 35%;"></div>
</div>
</div>
</div>
<!-- Main Chart -->
<div class="rounded-xl border border-slate-200 dark:border-white/10 p-6 bg-white dark:bg-white/5">
<div class="flex flex-wrap items-center justify-between gap-4 mb-4">
<h2 class="text-lg font-bold leading-tight tracking-[-0.015em] text-slate-900 dark:text-white">Monthly Progress</h2>
<div class="flex items-center gap-2 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
<button class="rounded-md px-3 py-1 text-xs font-medium text-slate-500 dark:text-slate-400">Week</button>
<button class="rounded-md bg-white px-3 py-1 text-xs font-bold text-slate-900 dark:bg-slate-700 dark:text-white">Month</button>
<button class="rounded-md px-3 py-1 text-xs font-medium text-slate-500 dark:text-slate-400">Year</button>
</div>
</div>
<div class="h-64 flex items-end justify-center">
<img alt="Bar chart showing daily prayer completion for the month." class="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxVUeMwlUzFxqUsugjF5Zaw9J5yZNIgbY081_BM-qPkKQQdJUjTl8XL4AXh5ZGEUdfuU1gAos7wGnLusr_qfPqgCafOgOT8xUc0Fv-un7MbwoXItZairPnMDqv2p9ElYAu4xo-qY3DaP_h2TBrCaaY2Y9PjKoV-6JTREaAtHEAfXKSazfB5kcoIbFf1pb7h7OBZIjncJWNf7BSXnvxPd1ncRNhlUHtgrUqDH2CvDLWVUWNqcWLXTR-APIpUfSLPibRM__AGl9vkjM">
</div>
</div>
</div>
<div class="lg:col-span-1 flex flex-col gap-8">
<!-- Donut Chart -->
<div class="rounded-xl border border-slate-200 dark:border-white/10 p-6 bg-white dark:bg-white/5">
<h2 class="text-lg font-bold leading-tight tracking-[-0.015em] text-slate-900 dark:text-white mb-4">Prayer Breakdown</h2>
<div class="flex justify-center items-center py-4">
<img alt="Donut chart showing breakdown of remaining prayers by type." class="w-48 h-48" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAC12NwCP7-dKeMsgS5x-bRMbwenEJ2yh6wrF_a0qHKaGhb6be8rdUK6JQq2wv3loHajSWUb8F0f_XnFMVBW-I7qWi3aSd_lYXBwGaZdf2gipcPO_hIMgZAKw1eaGg5b_qIaLiKsTdVm_MJh8PviR8-B4_oYHR3je8IH5Esv8qkn7r4LOWfE9REDpeqrnJe_UELzD1opA66CbyfDsxBbPQ6bWzMVOOsww8AKIehg6euKS8Q2GxQi6ZsI2HbrfOak85D67gXZF40UM">
</div>
<div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
<div class="flex items-center gap-2"><span class="size-2 rounded-full bg-[#13ec5b]"></span><span>Fajr: 150</span></div>
<div class="flex items-center gap-2"><span class="size-2 rounded-full bg-[#10a33f]"></span><span>Dhuhr: 250</span></div>
<div class="flex items-center gap-2"><span class="size-2 rounded-full bg-[#75f29c]"></span><span>Asr: 300</span></div>
<div class="flex items-center gap-2"><span class="size-2 rounded-full bg-[#caffd7]"></span><span>Maghrib: 204</span></div>
<div class="flex items-center gap-2 col-span-2"><span class="size-2 rounded-full bg-[#e2fce9]"></span><span>Isha: 300</span></div>
</div>
</div>
<!-- Infographic Card -->
<div class="rounded-xl border border-slate-200 dark:border-white/10 p-6 bg-white dark:bg-white/5">
<div class="flex items-start gap-4">
<div class="flex size-10 items-center justify-center rounded-full bg-primary/20 text-primary">
<span class="material-symbols-outlined">local_fire_department</span>
</div>
<div>
<p class="text-base font-medium leading-normal text-slate-600 dark:text-slate-400">Longest Streak</p>
<p class="text-2xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">14 Days</p>
</div>
</div>
</div>
<div class="rounded-xl border border-slate-200 dark:border-white/10 p-6 bg-white dark:bg-white/5">
<div class="flex items-start gap-4">
<div class="flex size-10 items-center justify-center rounded-full bg-primary/20 text-primary">
<span class="material-symbols-outlined">history</span>
</div>
<div>
<p class="text-base font-medium leading-normal text-slate-600 dark:text-slate-400">Last Prayer Logged</p>
<p class="text-lg font-bold leading-tight text-slate-900 dark:text-white">Today, 8:45 PM</p>
</div>
</div>
</div>
</div>
</div>
</div>
</template>
