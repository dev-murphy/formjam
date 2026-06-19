import { useTitle } from "@vueuse/core";
import pb from "@/db/pocketBase";
import { autosizeTextarea } from "@/utils/textareaAutosize";
import { nanoid } from "nanoid";

export async function createForm(): Promise<string> {
  const formData = await pb.collection("forms").create({
    title: "Untitled Form",
    description: "",
    status: "draft",
    view_mode: "list",
    starred: false,
    slug: nanoid(10),
    settings: {},
    user: pb.authStore.model?.id,
  });

  await pb.collection("questions").create({
    label: "Question 1",
    description: "",
    type: "single_choice",
    required: false,
    settings: {},
    form: formData.id,
    order: 1,
  });

  return formData.id;
}

export function getDefaultAnswer(questionType: string): string | string[] {
  return questionType === "multiple_choice" ? [] : "";
}

export function setupParagraphInputs(inputs: string[]) {
  setTimeout(() => {
    inputs.map((id) => {
      autosizeTextarea("textarea-" + id);
    });
  }, 10);
}

export function setPageTitle(formTitle: string) {
  let pageTitle = formTitle.replaceAll(/<\/?[^>]+(>|$)/g, "");
  pageTitle = (pageTitle || "Untitled Form") + " | FormJAM";
  useTitle(pageTitle);
}
