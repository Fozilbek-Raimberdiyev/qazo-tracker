<script setup lang="ts">
import { Form, FormItem } from 'ant-design-vue'
import { useLoginForm } from './useLoginForm'
import BaseFormLabel from '@/components/BaseFormLabel/BaseFormLabel.vue'
import BaseInput from '@/components/BaseInput/BaseInput.vue'
import BaseInputPassword from '@/components/BaseInputPassword/BaseInputPassword.vue'
import BaseButton from '@/components/BaseButton/BaseButton.vue'
const { formRef, formState, rules, isPending, mutateAsync } = useLoginForm()

function handleFinish() {
  mutateAsync()
}
</script>

<template>
  <div
    class="relative flex h-auto min-h-screen w-full flex-col dark group/design-root overflow-hidden bg-background-light dark:bg-background-dark font-display"
  >
    <div class="layout-container flex h-full grow flex-col">
      <div class="grid flex-1 grid-cols-1 md:grid-cols-2">
        <div
          class="relative hidden h-full md:flex flex-col items-center justify-center p-8 bg-black"
        >
          <div
            class="w-full h-full bg-center bg-no-repeat bg-cover rounded-xl"
            data-alt="Illustration of a serene mosque at night under a starry sky"
            style="
              background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBeIT7Fucuu8Z0o2FFAhyxk51sVlsVY4YYz1Tn2kN3E4rDvok885wAqwpsO4DDOtC_IYBKCp6o4x78miJS0L_Msb4rLYShQb4UCopH3ZN9sYlc1gnfdx0O1el_vekHrzhClfldwCMgKq4KfIXjngo1uus0zo63Ia5lmreeEVtpQk9fT8sbecqhlLwxVYP5yY6mAD6gzROKCx5EBj9EF4uAkXPLcUzxr9CjKmoLYkXCSZKjiU47MEfMLApDzEfjk0Djg1L1hGCipHvM');
            "
          ></div>
          <div class="absolute bottom-8 left-8 right-8 p-6 bg-black/50 backdrop-blur-md rounded-lg">
            <h2 class="text-white text-2xl font-bold font-display">Qaza Monitor</h2>
            <p class="text-gray-300 mt-2 font-display">
              Stay consistent and mindful of your spiritual duties.
            </p>
          </div>
        </div>
        <div class="flex flex-col items-center justify-center w-full p-4 sm:p-8">
          <div class="flex flex-col w-full max-w-md gap-6">
            <div class="flex flex-col gap-2 text-center md:text-left">
              <h1
                class="text-white text-4xl font-black leading-tight tracking-[-0.033em] font-display"
              >
                Welcome Back
              </h1>
              <p class="text-[#9db9a6] text-base font-normal leading-normal font-display">
                Log in to continue monitoring your prayers.
              </p>
            </div>
            <Form :model="formState" :rules ref="formRef" @finish="handleFinish" class="flex flex-col gap-4 w-full">
              <!-- firstName -->
              <FormItem name="email">
                <BaseFormLabel for="email" required> Elektron pochta </BaseFormLabel>
                <BaseInput
                  height="52px"
                  v-model="formState.email"
                  placeholder="Elektron pochtangizni kiriting"
                  id="email"
                ></BaseInput>
              </FormItem>
              <!-- password -->
              <FormItem name="password">
                <BaseFormLabel for="password" required> Parol </BaseFormLabel>
                <BaseInputPassword
                  height="52px"
                  v-model="formState.password"
                  placeholder="Elektron pochtangizni kiriting"
                  id="password"
                ></BaseInputPassword>
              </FormItem>
              <a
                class="text-[#9db9a6] text-sm font-normal leading-normal pt-1 text-right underline hover:text-primary font-display"
                href="#"
                >Forgot Password?</a
              >
              <BaseButton :loading="isPending" height="52px" type="primary" html-type="submit">Kirish</BaseButton>
              <button
                @click="$router.push('/auth/register')"
                class="flex items-center justify-center w-full h-14 px-6 font-display text-base font-bold text-white bg-primary/20 rounded-lg hover:bg-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark transition-colors"
                type="button"
              >
                Create an Account
              </button>
            </Form>
            <div class="flex items-center gap-4">
              <hr class="w-full border-t border-[#3b5443]" />
              <span class="text-[#9db9a6] text-sm font-medium">OR</span>
              <hr class="w-full border-t border-[#3b5443]" />
            </div>
            <button
              class="flex items-center justify-center w-full h-14 px-6 gap-3 font-display text-base font-bold text-white bg-transparent border border-[#3b5443] rounded-lg hover:bg-[#1c271f] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background-dark transition-colors"
              type="button"
            >
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25C22.56 11.45 22.49 10.68 22.36 9.92H12V14.48H18.15C17.82 16.03 16.94 17.35 15.65 18.24V21.1H19.51C21.52 19.23 22.56 16.05 22.56 12.25Z"
                  fill="#4285F4"
                ></path>
                <path
                  d="M12 23C14.97 23 17.45 22.04 19.51 20.55L15.65 17.66C14.65 18.32 13.45 18.69 12 18.69C9.38 18.69 7.15 16.93 6.3 14.54H2.34V17.43C4.26 20.86 7.89 23 12 23Z"
                  fill="#34A853"
                ></path>
                <path
                  d="M6.3 14.54C6.12 13.98 6 13.38 6 12.75C6 12.12 6.12 11.52 6.3 10.96V8.07H2.34C1.5 9.63 1 11.14 1 12.75C1 14.36 1.5 15.87 2.34 17.43L6.3 14.54Z"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M12 6.81C13.56 6.81 14.86 7.37 15.89 8.35L19.59 4.65C17.45 2.77 14.97 1.5 12 1.5C7.89 1.5 4.26 4.14 2.34 7.57L6.3 10.46C7.15 8.07 9.38 6.81 12 6.81Z"
                  fill="#EA4335"
                ></path>
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
