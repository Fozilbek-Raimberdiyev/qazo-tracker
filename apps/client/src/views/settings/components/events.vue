<script setup lang="ts">

</script>

<template> <div class="flex flex-col gap-8">
          <header>
            <h1
              class="text-2xl font-bold leading-tight tracking-tight text-text-light dark:text-text-dark"
            >
              Add New Qaza Events
            </h1>
          </header>
          <!-- Section 1: Add Qaza Prayer -->
          <section class="flex flex-col gap-4">
            <div class="border-b border-border-light dark:border-border-dark pb-4">
              <h2 class="text-xl font-semibold leading-tight text-text-light dark:text-text-dark">
                Log a Missed Prayer
              </h2>
            </div>
            <div class="flex flex-col gap-6 md:flex-row md:gap-4">
              <label class="flex flex-col w-full md:flex-1">
                <p class="pb-2 text-sm font-medium">Prayer Name</p>
                <select
                  class="form-select w-full rounded-DEFAULT border border-border-light bg-input-light dark:border-border-dark dark:bg-input-dark text-text-light dark:text-text-dark focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option>Select prayer (Fajr, Dhuhr, etc.)</option>
                  <option value="fajr">Fajr</option>
                  <option value="dhuhr">Dhuhr</option>
                  <option value="asr">Asr</option>
                  <option value="maghrib">Maghrib</option>
                  <option value="isha">Isha</option>
                  <option value="witr">Witr</option>
                </select>
              </label>
              <label class="flex flex-col w-full md:flex-1">
                <p class="pb-2 text-sm font-medium">Date</p>
                <input
                  class="form-input w-full rounded-DEFAULT border border-border-light bg-input-light dark:border-border-dark dark:bg-input-dark text-text-light dark:text-text-dark placeholder:text-subtle-light dark:placeholder:text-subtle-dark focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Select a date"
                  type="date"
                />
              </label>
              <label class="flex flex-col w-full md:w-auto">
                <p class="pb-2 text-sm font-medium">Number</p>
                <input
                  class="form-input w-full md:w-32 rounded-DEFAULT border border-border-light bg-input-light dark:border-border-dark dark:bg-input-dark text-text-light dark:text-text-dark placeholder:text-subtle-light dark:placeholder:text-subtle-dark focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g. 1"
                  type="number"
                  value="1"
                />
              </label>
            </div>
            <div class="flex justify-end">
              <button
                class="flex items-center justify-center rounded-DEFAULT bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark"
              >
                Add Prayer
              </button>
            </div>
          </section>
          <!-- Section 2: Add Qaza Fast -->
          <section class="flex flex-col gap-4">
            <div class="border-b border-border-light dark:border-border-dark pb-4">
              <h2 class="text-xl font-semibold leading-tight text-text-light dark:text-text-dark">
                Log a Missed Fast
              </h2>
            </div>
            <div class="flex flex-col gap-6 md:flex-row md:gap-4">
              <label class="flex flex-col w-full md:flex-1">
                <p class="pb-2 text-sm font-medium">Date</p>
                <input
                  class="form-input w-full rounded-DEFAULT border border-border-light bg-input-light dark:border-border-dark dark:bg-input-dark text-text-light dark:text-text-dark placeholder:text-subtle-light dark:placeholder:text-subtle-dark focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Select a date"
                  type="date"
                />
              </label>
              <label class="flex flex-col w-full md:w-auto">
                <p class="pb-2 text-sm font-medium">Number of Fasts</p>
                <input
                  class="form-input w-full md:w-32 rounded-DEFAULT border border-border-light bg-input-light dark:border-border-dark dark:bg-input-dark text-text-light dark:text-text-dark placeholder:text-subtle-light dark:placeholder:text-subtle-dark focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g. 1"
                  type="number"
                  value="1"
                />
              </label>
            </div>
            <div class="flex justify-end">
              <button
                class="flex items-center justify-center rounded-DEFAULT bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark"
              >
                Add Fast
              </button>
            </div>
          </section>
        </div></template>
