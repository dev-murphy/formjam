import { createRouter, createWebHistory } from "vue-router";
import { middleware } from "@/router/middleware";

import HomePage from "@/pages/index.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomePage,
      meta: {
        layout: "Default",
        title: "Home",
      },
    },
    {
      path: "/auth",
      name: "Auth",
      redirect: (to) => {
        if (to.name === "Signup" || to.name === "Login") {
          return { path: to.fullPath };
        }
        return { path: "/auth/login" };
      },
      meta: {
        layout: "Auth",
      },
      children: [
        {
          path: "/auth/login",
          name: "Login",
          component: () => import("@/components/auth/Login.vue"),
          meta: {
            title: "Login",
          },
        },
        {
          path: "signup",
          name: "Signup",
          component: () => import("@/components/auth/Signup.vue"),
          meta: {
            title: "Signup",
          },
        },
        {
          path: "reset-your-password",
          name: "PasswordRest",
          component: () => import("@/components/auth/PasswordReset.vue"),
          meta: {
            title: "PasswordReset",
          },
        },
        {
          path: "confirm-password-reset/:token(.*)",
          name: "ConfirmPasswordReset",
          component: () => import("@/components/auth/ConfirmPassword.vue"),
          meta: {
            title: "ConfirmPasswordReset",
          },
        },
      ],
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: () => import("@/pages/dashboard.vue"),
      meta: {
        layout: "Dashboard",
        authRequired: true,
        title: "Dashboard",
      },
    },
    {
      path: "/profile",
      name: "Profile",
      component: () => import("@/pages/profile.vue"),
      meta: {
        layout: "Dashboard",
        authRequired: true,
        title: "Profile",
      },
    },
    {
      path: "/form/:formId",
      meta: {
        layout: "Form",
        authRequired: true,
      },
      children: [
        {
          path: "edit",
          name: "EditForm",
          component: () => import("@/pages/form/edit.vue"),
        },
        {
          path: "view",
          name: "ViewForm",
          component: () => import("@/pages/form/view.vue"),
          // Public so shared links can collect responses without a login.
          meta: {
            authRequired: false,
          },
        },
        {
          path: "preview",
          name: "PreviewForm",
          component: () => import("@/pages/form/preview.vue"),
          meta: {
            authRequired: true
          }
        },
        {
          path: "success",
          name: "SuccessForm",
          component: () => import("@/pages/form/success.vue"),
        },
      ],
    },
    {
      path: "/error",
      name: "Error",
      component: () => import("@/pages/error.vue"),
      meta: {
        layout: "Default",
        title: "Error",
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("@/pages/404.vue"),
      meta: {
        layout: "Default",
        title: "NotFound",
      },
    },
  ],
});

router.beforeEach(middleware);
export default router;
