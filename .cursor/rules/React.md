# Next.js / React Conventions

## Typing

- Type everything. No implicit any.
- Component and page props: define the prop type in the same file, directly above the component.
- Any other types (data shapes, API responses, shared unions) go in `{feature}.types.ts` in that feature's folder.
- Components used only within one feature live inside that feature's folder. Don't move something to a shared location until it's actually reused elsewhere.

## Hooks & Logic

- Pull hooks and non-trivial logic into their own file, separate from the component that uses them.
- Keep files readable — aim for under ~200 lines.
- If logic genuinely can't be split out cleanly, it's fine to keep it in the component. Don't force extraction just to satisfy this rule.

## Constants

- No magic numbers. Anything that isn't self-explanatory goes in `{feature}.constants.ts`.
- Don't over-do it — only extract values that actually need a name to make sense. Not every literal needs to become a constant.
- UI text: only extract to a separate file if it needs translation/i18n. Otherwise plain copy can stay inline in the component.

## Functions

- Always use arrow functions — components, hooks, handlers, utilities, all of it.

## Conditional Logic

- Keep logic minimal and obvious.
- Compute conditions that control visibility (e.g. "should this button show?") as a named variable before the return, not buried inline in JSX.
- Treat an element that unexpectedly fails to render as a bug. Logic should be traceable enough that it's obvious why something didn't show.
