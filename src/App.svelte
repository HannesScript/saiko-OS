<script lang="ts">
  import Window from "./lib/Window.svelte";
  import settings from "./lib/settings";
  import { onMount } from "svelte";

  // State Variables
  let osname = "最高OS";
  let electron = (window as any).electron;
  let loggedIn = true;
  let pw: string;
  let mainMenuOpen: boolean = false;
  let mainMenuApps = [
    {
      name: "Settings",
      icon: "apps/settings.sapp/settings.png",
      path: "apps/settings.sapp/",
    },
    {
      name: "Calculator",
      icon: "apps/calculator.sapp/logo.png",
      path: "apps/calculator.sapp/",
    },
  ];

  let windows: {
    pathToApp: string;
    isOpen: boolean;
  }[] = [];

  let time: string = new Date().getHours() + ":" + new Date().getMinutes();
  let date: string =
    new Date().getDate() +
    "/" +
    `${(new Date().getMonth() + 1).toString()}` +
    "/" +
    new Date().getFullYear();

  openApp("apps/settings.sapp/");

  // Functions
  function openApp(path: string | null) {
    if (path && !windows.some((window) => window.pathToApp === path)) {
      windows = [...windows, { pathToApp: path, isOpen: true }];
    }
  }

  function closeWindow(index: number) {
    windows = windows.filter((_, idx) => idx !== index);
  }

  // Reactive Statements
  $: {
    const root: any = document.querySelector(":root");
    if (root) {
      root.style.setProperty("--primary-swatch", settings.primarySwatch);
      root.style.setProperty("--primary-light", settings.primaryLight);
      root.style.setProperty(
        "--animation-speed",
        settings.animationSpeed,
      );
      root.style.setProperty("--secondary-swatch", settings.secondarySwatch);
    }
  }

  // Lifecycle Hooks
  onMount(() => {
    document
      .getElementById("login-password-input")
      ?.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && pw == settings.pw) {
          loggedIn = true;
        }
      });

    setInterval(() => {
      let timeMinutes = new Date().getMinutes();
      let timeHours = new Date().getHours();
      time = (timeHours <= 9 ? "0" + timeHours.toString() : timeHours.toString()) + ":" + (timeMinutes <= 9 ? "0" + timeMinutes.toString() : timeMinutes.toString());
      date =
        new Date().getDate() +
        "." +
        `${(parseInt(new Date().getMonth().toString(), 10) + 1).toString()}` +
        "." +
        new Date().getFullYear();
    }, 500);
  });
</script>

{#if loggedIn}
  <main class="relative flex flex-col">
    <div class="absolute bg-img">
      <div class="relative">
        <div class="overlay"></div>
        <div
          class="flex"
          style="width: 100%; height: 100%; justify-content: center;"
        >
          <img src={settings.bgImg} alt="Background" class="bg-image" />
        </div>
      </div>
    </div>
    <div class="desktop">
      {#each windows as window, idx}
        <Window pathtoapp={windows[idx].pathToApp} {idx} {closeWindow} />
      {/each}
    </div>
    <div class="bar absolute flex align-center justify-between pl-16 pr-16">
      <!-- Left -->
      <div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <img
          src="logo.png"
          alt=""
          class="img-ratio-1:1 logo"
          on:click={() => (mainMenuOpen = true)}
        />
      </div>

      <!-- Middle -->
      <div class="flex gap-2" style="align-items: end;">
        {#each windows.filter((item) => item.isOpen) as app}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div
            class="br-8 app flex flex-col align-center"
            on:click={() => openApp(app.pathToApp)}
            title={electron.getAppConfig(app.pathToApp).then(data => data.name)}
          >
            <img
              src={electron.getAppConfig(app.pathToApp).then(data => data.icon)}
              alt=""
              class="img-xs img-ratio-1:1"
            />
          </div>
        {/each}
      </div>

      <!-- Right -->
      <div class="flex flex-col align-center">
        <span class="text-white">{time}</span>
        <span class="text-white">{date}</span>
      </div>
    </div>
    <div class="main-menu" style={mainMenuOpen ? "" : "display: none;"}>
      <div class="relative">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="close" on:click={() => (mainMenuOpen = false)}>
          <span
            class="material-symbols-outlined text-size-lg"
            style="color: var(--secondary-swatch);">close</span
          >
        </div>
        <div class="grid">
          {#each mainMenuApps as app (app.path)}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
              class="app"
              title={app.name}
              on:click={() => openApp(app.path)}
            >
              <img
                src={app.icon || "logo.png"}
                alt=""
                style="height: 100%; width: 100%;"
              />
            </div>
          {/each}
        </div>
      </div>
    </div>
  </main>
{:else}
  <div class="relative flex flex-col">
    <div class="absolute bg-img">
      <div class="relative">
        <div class="overlay"></div>
        <div
          class="flex"
          style="width: 100%; height: 100%; justify-content: center;"
        >
          <img src={settings.bgImg} alt="Background" class="bg-image" />
        </div>
      </div>
    </div>
    <div
      class="absolute flex justify-center align-center"
      style="height: 100vh; width: 100vw;"
    >
      <div
        class="p-8 br-8 flex flex-col gap-4 align-center login-box"
        style="background-color: transparent; height: 45vh; width: 22.5vw;"
      >
        <h1 style="color: var(--secondary-swatch);">{settings.username}</h1>
        <div
          class={settings.userimage
            ? "img-ratio-1:1 round flex justify-center align-center"
            : "img-ratio-1:1 round flex justify-center align-center bg-gray-500 p-8"}
          style="height: 10rem; width: 10rem;"
        >
          {#if settings.userimage}
            <img
              src={settings.userimage}
              alt=""
              style="height: 100%; width: 100%;"
            />
          {:else}
            <span
              class="material-symbols-outlined text-gray-300"
              style="font-size: 9rem;">person</span
            >
          {/if}
        </div>
        <input
          type="password"
          id="login-password-input"
          class="br-4 p-8 border-none"
          placeholder="Password"
          style="background-color: var(--primary-light);"
          bind:value={pw}
        />
      </div>
    </div>
  </div>
{/if}

<style>
  :root {
    --bar-height: 4.5vh;
  }

  .bg-img {
    height: 100vh;
    width: 100vw;
    position: relative;
  }

  .bg-img .relative {
    position: relative;
    height: 100%;
    width: 100%;
  }

  .bg-img .overlay {
    height: 100%;
    width: 100%;
    background-color: black;
    position: absolute;
    z-index: -10;
    top: 0;
    left: 0;
  }

  .bg-image {
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
  }

  .bar {
    background-color: var(--primary-swatch);
    height: var(--bar-height);
    width: 100vw;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
    transition: all calc(1000ms / var(--animation-speed)) ease;
  }

  .bar .logo {
    height: calc(var(--bar-height) * 0.75);
    transition: all calc(1000ms / var(--animation-speed));
    cursor: pointer;
  }

  .bar img {
    height: calc(5vh / 1.5);
  }

  .bar > div:nth-child(2) > .app {
    cursor: pointer;
    transition: all calc(1075ms / var(--animation-speed)) ease;
  }

  .bar > div:nth-child(2) > .app:hover {
    transform: scale(140%);
  }

  .main-menu {
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: var(--primary-light);
    z-index: 999;
  }

  .main-menu > div > div {
    grid-template-columns: repeat(3, 7rem);
    grid-template-rows: repeat(4, 7rem);
  }

  .main-menu > div > div > .app {
    border: 0.1px solid rgba(158, 158, 158, 0.05);
    background-color: rgba(158, 158, 158, 0.1);
    cursor: pointer;
  }

  .main-menu .close {
    position: absolute;
    right: 3px;
    top: 3px;
    cursor: pointer;
  }
</style>
