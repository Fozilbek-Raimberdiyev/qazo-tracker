<script setup lang="ts">
import BaseButton from '@/components/BaseButton/BaseButton.vue'
import BaseFormLabel from '@/components/BaseFormLabel/BaseFormLabel.vue'
import BaseInput from '@/components/BaseInput/BaseInput.vue'
import BaseInputPassword from '@/components/BaseInputPassword/BaseInputPassword.vue'
import { Form, FormItem } from 'ant-design-vue'
import { useRegisterForm } from './useRegisterForm'
const { formRef, formState, rules,isPending,mutateAsync } = useRegisterForm()

function handleFinish() {
  mutateAsync()
}
</script>
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
            <Form
              ref="formRef"
              :rules="rules"
              :model="formState"
              @finish="handleFinish"
              class="flex w-full flex-col"
            >
              <!-- firstName -->
              <FormItem name="firstName">
                <BaseFormLabel for="firstName" required>Ismingiz</BaseFormLabel>
                <BaseInput
                  placeholder="Ismingizni kiriting"
                  height="52px"
                  id="firstName"
                  v-model="formState.firstName"
                ></BaseInput>
              </FormItem>
              <!-- lastName -->
              <FormItem name="lastName">
                <BaseFormLabel for="lastName" required>Familiyangiz</BaseFormLabel>
                <BaseInput
                  placeholder="Familiyangizni kiriting"
                  height="52px"
                  id="lastName"
                  v-model="formState.lastName"
                ></BaseInput>
              </FormItem>
              <!-- email -->
              <FormItem name="email">
                <BaseFormLabel for="email" required>Elektron pochta</BaseFormLabel>
                <BaseInput
                  placeholder="Elektron pochtangizni kiriting"
                  height="52px"
                  id="email"
                  v-model="formState.email"
                ></BaseInput>
              </FormItem>
              <!-- passowrd -->
              <FormItem name="password">
                <BaseFormLabel for="password" required>Parol</BaseFormLabel>
                <BaseInputPassword
                  placeholder="Parol kiriting"
                  height="52px"
                  id="password"
                  v-model="formState.password"
                ></BaseInputPassword>
              </FormItem>
              <!--confirm passowrd -->
              <FormItem name="confirmPassword">
                <BaseFormLabel for="confirmPassword" required>Parolni tasdiqlang</BaseFormLabel>
                <BaseInputPassword
                  placeholder="Parolni tasdiqlang"
                  height="52px"
                  id="confirmPassword"
                  v-model="formState.confirmPassword"
                ></BaseInputPassword>
              </FormItem>
              <!-- CTA Button -->
              <BaseButton :loading="isPending" html-type="submit" type="primary" height="52px"
                >Ro'yxatdan o'tish</BaseButton
              >
              <!-- Secondary Link -->
              <p class="text-center text-[#9db9a6] text-sm">
                Already have an account?
                <RouterLink class="font-semibold text-primary hover:underline" to="/auth/login"
                  >Kirish</RouterLink
                >
              </p>
            </Form>
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
