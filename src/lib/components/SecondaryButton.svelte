<script lang="ts">
  import { createBubbler } from "svelte/legacy";

  const bubble = createBubbler();
  interface Props {
    fullWidth?: boolean;
    disabled?: boolean;
    children?: import("svelte").Snippet;
  }

  let { fullWidth = false, disabled = false, children }: Props = $props();

  let buttonClasses = $derived(
    `flex h-[40px] justify-center items-center px-4 rounded-lg bg-secondary-active-button-background hover:bg-secondary-active-button-background-hover ${fullWidth ? "w-full" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`
  );
</script>

<button class={buttonClasses} {disabled} onclick={bubble("click")}>
  {@render children?.()}
</button>
