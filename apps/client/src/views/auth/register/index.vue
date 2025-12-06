<script setup lang="ts"></script>
<template>
  <div
    class="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark text-[#1d2939] dark:text-white group/design-root overflow-x-hidden font-display"
  >
    <div class="layout-container flex h-full w-full grow flex-col">
      <div class="flex flex-1 justify-center p-4 sm:p-6 md:p-8">
        <div class="flex w-full max-w-md flex-col items-center">
          <!-- Header/Logo -->
          <header class="mb-8 flex w-full items-center justify-center gap-3 text-white">
            <div class="text-primary size-6">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <h2 class="text-[#f0fdf4] text-2xl font-bold leading-tight tracking-[-0.015em]">
              Qaza Tracker
            </h2>
          </header>
          <main class="w-full">
            <!-- Page Heading -->
            <div class="mb-8 text-center">
              <h1 class="text-[#f0fdf4] text-4xl font-black leading-tight tracking-[-0.033em]">
                Create Your Account
              </h1>
              <p class="text-[#9db9a6] text-base font-normal leading-normal mt-3">
                Begin your journey of tracking and completing your Qaza prayers.
              </p>
            </div>
            <!-- Registration Form -->
            <div class="flex w-full flex-col gap-5">
              <!-- Full Name Field -->
              <label class="flex flex-col flex-1">
                <p class="text-[#f0fdf4] text-base font-medium leading-normal pb-2">Full Name</p>
                <input
                  class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#f0fdf4] focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#3b5443] bg-[#1c271f] focus:border-primary h-14 placeholder:text-[#9db9a6] p-[15px] text-base font-normal leading-normal transition-colors"
                  placeholder="Enter your full name"
                  value=""
                />
              </label>
              <!-- Email Address Field -->
              <label class="flex flex-col flex-1">
                <p class="text-[#f0fdf4] text-base font-medium leading-normal pb-2">
                  Email Address
                </p>
                <input
                  class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#f0fdf4] focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#3b5443] bg-[#1c271f] focus:border-primary h-14 placeholder:text-[#9db9a6] p-[15px] text-base font-normal leading-normal transition-colors"
                  placeholder="Enter your email"
                  type="email"
                  value=""
                />
              </label>
              <!-- Password Field -->
              <label class="flex flex-col flex-1">
                <p class="text-[#f0fdf4] text-base font-medium leading-normal pb-2">Password</p>
                <div
                  class="flex w-full flex-1 items-stretch rounded-lg focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-colors"
                >
                  <input
                    class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-lg text-[#f0fdf4] focus:outline-0 focus:ring-0 border border-[#3b5443] bg-[#1c271f] focus:border-primary h-14 placeholder:text-[#9db9a6] p-[15px] border-r-0 pr-2 text-base font-normal leading-normal"
                    placeholder="Enter your password"
                    type="password"
                    value=""
                  />
                  <button
                    class="text-[#9db9a6] flex border border-[#3b5443] bg-[#1c271f] items-center justify-center px-4 rounded-r-lg border-l-0 hover:text-primary focus:outline-none focus:text-primary transition-colors"
                  >
                    <span class="material-symbols-outlined" data-icon="Eye">visibility_off</span>
                  </button>
                </div>
                <p class="text-sm text-[#9db9a6] mt-1.5">
                  Password must be at least 8 characters long.
                </p>
              </label>
              <!-- Confirm Password Field -->
              <label class="flex flex-col flex-1">
                <p class="text-[#f0fdf4] text-base font-medium leading-normal pb-2">
                  Confirm Password
                </p>
                <div
                  class="flex w-full flex-1 items-stretch rounded-lg focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-colors"
                >
                  <input
                    class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-lg text-[#f0fdf4] focus:outline-0 focus:ring-0 border border-[#3b5443] bg-[#1c271f] focus:border-primary h-14 placeholder:text-[#9db9a6] p-[15px] border-r-0 pr-2 text-base font-normal leading-normal"
                    placeholder="Confirm your password"
                    type="password"
                    value=""
                  />
                  <button
                    class="text-[#9db9a6] flex border border-[#3b5443] bg-[#1c271f] items-center justify-center px-4 rounded-r-lg border-l-0 hover:text-primary focus:outline-none focus:text-primary transition-colors"
                  >
                    <span class="material-symbols-outlined" data-icon="Eye">visibility_off</span>
                  </button>
                </div>
              </label>
              <!-- CTA Button -->
              <button
                class="flex items-center justify-center whitespace-nowrap h-14 p-4 rounded-lg text-base font-semibold text-background-dark bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark transition-all mt-4"
              >
                Create Account
              </button>
              <!-- Secondary Link -->
              <p class="text-center text-[#9db9a6] text-sm">
                Already have an account?
                <a class="font-semibold text-primary hover:underline" href="#">Log In</a>
              </p>
            </div>
          </main>
          <!-- Footer -->
          <footer class="mt-12 text-center">
            <p class="text-[#6b7280] dark:text-[#9db9a6] text-xs">
              By creating an account, you agree to our
              <a class="underline hover:text-primary" href="#">Terms of Service</a> and
              <a class="underline hover:text-primary" href="#">Privacy Policy</a>.
            </p>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>
