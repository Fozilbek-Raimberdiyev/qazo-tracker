<template>
  <body
    class="bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark"
  >
    <div class="relative flex h-auto min-h-screen w-full flex-col">
      <div class="flex h-full min-h-screen w-full grow">
        <div class="flex flex-1 flex-col">
          <main class="flex-1">
            <div class="container mx-auto max-w-6xl px-4 py-8 md:py-12">
              <div class="flex flex-col gap-8 md:flex-row md:gap-12">
                <aside class="w-full md:w-1/4">
                  <nav class="flex flex-col gap-1">
                    <a
                      class="flex items-center gap-3 rounded-DEFAULT px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5"
                      href="#"
                    >
                      <span
                        class="material-symbols-outlined text-subtle-light dark:text-subtle-dark"
                        >person</span
                      >
                      <span>Profile</span>
                    </a>
                    <a
                      class="flex items-center gap-3 rounded-DEFAULT px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5"
                      href="#"
                    >
                      <span
                        class="material-symbols-outlined text-subtle-light dark:text-subtle-dark"
                        >account_circle</span
                      >
                      <span>Account</span>
                    </a>
                    <a
                      class="flex items-center gap-3 rounded-DEFAULT px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5"
                      href="#"
                    >
                      <span
                        class="material-symbols-outlined text-subtle-light dark:text-subtle-dark"
                        >add_circle</span
                      >
                      <span>Add Events</span>
                    </a>
                    <a
                      class="flex items-center gap-3 rounded-DEFAULT px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5"
                      href="#"
                    >
                      <span
                        class="material-symbols-outlined text-subtle-light dark:text-subtle-dark"
                        >notifications</span
                      >
                      <span>Notifications</span>
                    </a>
                    <a
                      class="flex items-center gap-3 rounded-DEFAULT bg-primary/10 px-3 py-2 text-sm font-semibold text-primary"
                      href="#"
                    >
                      <span class="material-symbols-outlined">contrast</span>
                      <span>Appearance</span>
                    </a>
                  </nav>
                </aside>
                <div class="w-full md:w-3/4">
                  <div class="flex flex-col gap-8">
                    <header>
                      <h1
                        class="text-2xl font-bold leading-tight tracking-tight text-text-light dark:text-text-dark"
                      >
                        Appearance
                      </h1>
                      <p class="mt-1 text-subtle-light dark:text-subtle-dark">
                        Customize the look and feel of the application.
                      </p>
                    </header>
                    <section class="flex flex-col gap-4">
                      <div class="border-b border-border-light dark:border-border-dark pb-4">
                        <h2
                          class="text-xl font-semibold leading-tight text-text-light dark:text-text-dark"
                        >
                          Theme
                        </h2>
                        <p class="mt-1 text-sm text-subtle-light dark:text-subtle-dark">
                          Select your preferred interface theme.
                        </p>
                      </div>
                      <div
                        class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
                      >
                        <p class="font-medium">Theme mode</p>
                        <div
                          class="flex items-center gap-2 rounded-lg bg-background-light p-1 dark:bg-input-dark"
                        >
                          <button
                            class="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-subtle-light dark:text-subtle-dark"
                          >
                            <span class="material-symbols-outlined !text-base">light_mode</span>
                            Light
                          </button>
                          <button
                            class="flex items-center gap-2 rounded-md bg-card-light px-3 py-1.5 text-sm font-semibold text-text-light shadow-sm dark:bg-card-dark dark:text-text-dark"
                          >
                            <span class="material-symbols-outlined !text-base">dark_mode</span>
                            Dark
                          </button>
                          <button
                            class="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-subtle-light dark:text-subtle-dark"
                          >
                            <span class="material-symbols-outlined !text-base"
                              >desktop_windows</span
                            >
                            System
                          </button>
                        </div>
                      </div>
                    </section>
                    <section class="flex flex-col gap-4">
                      <div class="border-b border-border-light dark:border-border-dark pb-4">
                        <h2
                          class="text-xl font-semibold leading-tight text-text-light dark:text-text-dark"
                        >
                          Preferences
                        </h2>
                      </div>
                      <div class="flex items-center justify-between">
                        <div>
                          <h3 class="font-medium text-text-light dark:text-text-dark">
                            Show avatars
                          </h3>
                          <p class="text-sm text-subtle-light dark:text-subtle-dark">
                            Display user avatars throughout the application.
                          </p>
                        </div>
                        <label class="relative inline-flex cursor-pointer items-center">
                          <input checked class="peer sr-only" type="checkbox" />
                          <div
                            class="peer h-6 w-11 rounded-full bg-border-light after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 dark:border-gray-600 dark:bg-gray-700"
                          ></div>
                        </label>
                      </div>
                      <div class="flex items-center justify-between">
                        <div>
                          <h3 class="font-medium text-text-light dark:text-text-dark">
                            Compact UI
                          </h3>
                          <p class="text-sm text-subtle-light dark:text-subtle-dark">
                            Reduce spacing to fit more content on the screen.
                          </p>
                        </div>
                        <label class="relative inline-flex cursor-pointer items-center">
                          <input class="peer sr-only" type="checkbox" />
                          <div
                            class="peer h-6 w-11 rounded-full bg-border-light after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 dark:border-gray-600 dark:bg-gray-700"
                          ></div>
                        </label>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  </body>
</template>
