<script lang="ts">
    import { onDestroy } from "svelte";
    import App from "./App.svelte";

    let loaded = false;
    let loadedState = 0;

    // Code
    let loadedOn = 5200;
    setTimeout(() => {
        fetch("http://localhost:8080/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ saiko: "el}s%ie24#" }),
        });
    }, 500)


    let loading = setInterval(() => {
        if(loadedState >= loadedOn) {
            clearInterval(loading);
            setTimeout(() => {
                loaded = true;
            }, 300);
        } else {
            let time = Math.random() * 500;
            setTimeout(() => {
                loadedState += time > 300 ? 10 : 1;
            }, time);
        }
    }, 1);

    onDestroy(() => {
        clearInterval(loading);
    });
</script>

{#if loaded}
    <App></App>
{:else}
    <div class="flex align-center justify-center flex-col gap-3 bg-black text-white" style="height: 100dvh; width: 100dvw;">
        <!-- Logo -->
        <img src="logo.png" alt="Logo" class="img-ratio-1:1" style="height: 17rem;">
        <h1>Saiko-OS</h1>
        <span>&nbsp;</span>
        <span>&nbsp;</span>
        <!-- <h3>Loading</h3> -->
        <progress value={loadedState} max={loadedOn} class="loading-bar"></progress>
    </div>
{/if}

<style>
    .loading-bar {
        width: 20dvw;
        transition: all 0.1s ease;
        overflow: hidden;
        background-color: rgb(0, 36, 36);
        height: 0.6rem;
        border-radius: 100rem;
    }

    .loading-bar::-webkit-progress-value { background: #c7521c; }
</style>