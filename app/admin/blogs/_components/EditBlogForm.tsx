"use client";

import { useActionState } from "react";
import { updateBlogFormAction } from "@/lib/actions/blog.actions";
import { BlogFormFields } from "./BlogFormFields";

type Props = {
  id: string;
  defaultValues: {
    title: string;
    excerpt: string;
    body: string;
  };
};

export function EditBlogForm({ id, defaultValues }: Props) {
  // .bind(null, id) pre-fills the first arg so the signature becomes
  // (prevState, formData) — exactly what useActionState expects.
  // Because updateBlogFormAction is a "use server" function, .bind() on it
  // produces a new server action, which is safe to pass to useActionState.
  const boundAction = updateBlogFormAction.bind(null, id);
  const [state, formAction, isPending] = useActionState(boundAction, null);

  return (
    <BlogFormFields
      formAction={formAction}
      state={state}
      isPending={isPending}
      defaultValues={defaultValues}
      submitLabel="Save changes"
    />
  );
}
