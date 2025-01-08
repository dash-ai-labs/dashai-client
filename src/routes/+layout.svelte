<script lang="ts">
  import "../app.css";
  import { onMount } from "svelte";
  import { initializeLayout } from "$lib/layout";

  interface Props {
    children?: import("svelte").Snippet;
    data: {
      nonce: string;
    };
  }

  let { children, data }: Props = $props();

  onMount(initializeLayout);
</script>

<div class="dashboard">
  {@render children?.()}
</div>

<style nonce="{data.nonce}">
  .dashboard {
    display: flex;
    height: 100vh;
    background-color: #1a1a1a;
    color: white;
  }
</style>
