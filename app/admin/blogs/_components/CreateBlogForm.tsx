"use client";

import { useActionState } from "react";
import { createBlogFormAction } from "@/lib/actions/blog.actions";
import { BlogFormFields } from "./BlogFormFields";

export function CreateBlogForm() {
  const [state, formAction, isPending] = useActionState(createBlogFormAction, null);

  return (
    <BlogFormFields
      formAction={formAction}
      state={state}
      isPending={isPending}
      submitLabel="Publish post"
    />
  );
}
