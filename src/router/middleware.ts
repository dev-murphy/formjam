import { RouteLocationNormalized } from "vue-router";
import pb from "@/db/pocketBase";

export const middleware = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
) => {
  const isAuthenticated = pb.authStore.isValid;
  const authBlackList = ["Login", "Signup", "Home"];
  const routeName = to.meta?.title;

  if (routeName) document.title = `${routeName} | FormJAM`;

  if (to.meta.authRequired && !isAuthenticated) {
    return { name: "Login" };
  }

  if (isAuthenticated && to.name && authBlackList.includes(to.name.toString())) {
    return { name: "Dashboard" };
  }

  if (
    to.name === "SuccessForm" &&
    !(from.name === "PreviewForm" || from.name === "ViewForm")
  ) {
    return from.fullPath;
  }
};
