<script lang="ts">
  import { createBubbler } from "svelte/legacy";

  const bubble = createBubbler();
  interface Props {
    fullWidth?: boolean;
    disabled?: boolean;
    classes?: string;
    children?: import("svelte").Snippet;
  }

  let {
    fullWidth = false,
    disabled = false,
    classes = "",
    children,
  }: Props = $props();
</script>

<button
  class="flex flex-col justify-center items-center px-6 py-2.5 h-10 gap-2 bg-primary-button rounded-[10px] text-secondary-active-button-background {fullWidth
    ? 'w-full'
    : ''} {classes}"
  {disabled}
  onclick={bubble("click")}
>
  {@render children?.()}
</button>
