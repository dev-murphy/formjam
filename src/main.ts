import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import { createPinia } from "pinia";

import PrimeVue from "primevue/config";
import Lara from "@primevue/themes/lara";
import Tooltip from "primevue/tooltip";
import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice";

createApp(App)
  .use(router)
  .use(createPinia())
  .use(PrimeVue, { theme: { preset: Lara } })
  .use(ConfirmationService)
  .use(ToastService)
  .directive('tooltip', Tooltip)
  .mount("#app");
