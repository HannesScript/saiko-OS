<script lang="ts">
    import { onMount } from "svelte";

    export let pathtoapp: string;
    export let windowIsOpen: boolean = true;
    export let idx: number = 0;
    let electron = (window as any).electron;
    export let closeWindow: (index: number) => void;

    let appdata: {
        name?: String;
        icon?: String;
        app?: String;
        width?: Number;
        height?: Number;
    } = {};

    let winId = "window-" + Math.floor(Math.random() * 100).toString();

    onMount(async () => {
        const windowElement = document.getElementById(winId);
        if (windowElement) {
            dragElement(windowElement);
        }
        await getConfig();
        code = await getCode();
    });
    let code: string = "";

    async function getConfig() {
        try {
            const data = JSON.parse(
                await electron.readFile(await electron.get(pathtoapp, "/sapp.json"))
            );
            console.log("Config data:", data); // Log the data to see what it looks like
            appdata = data;
        } catch (error) {
            console.error("Error fetching config:", error);
        }
    }

    async function getCode() {
        try {
            let path = (await electron.get(pathtoapp, appdata.app)).toString();
            let code =  await electron.readFile(path);
            return code.replaceAll("./", pathtoapp + "/");
        } catch (error) {
            console.error("Error fetching code:", error);
            return "";
        }
    }

    function dragElement(elmnt: HTMLElement) {
        let pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;

        const header = document.getElementById(winId + "header");
        if (header) {
            header.onmousedown = dragMouseDown;
        } else {
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e: MouseEvent) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e: MouseEvent) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elmnt.style.top = elmnt.offsetTop - pos2 + "px";
            elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
</script>

{#if windowIsOpen}
    <div class="window flex flex-col" id={winId} style={`min-width: ${appdata.width || 800}px; min-height: ${appdata.height || 550}px;`}>
        <div
            class="flex align-center justify-between"
            id={winId + "header"}
            style="background-color: var(--primary-swatch);"
        >
            <div class="flex gap-2">
                <img
                    src={pathtoapp + "/" + (appdata.icon ?? "icon.png")}
                    alt="Window Icon"
                    class="img-ratio-1:1"
                    style="height: 1.5rem;"
                />
                <span style="color: var(--secondary-swatch);">
                    {appdata.name ?? "My App"}
                </span>
            </div>
            <div class="flex align-center">
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div
                    class="button-right close-button bg-red-500"
                    on:click={() => closeWindow(idx)}
                >
                    <span class="material-symbols-outlined text-white">
                        close
                    </span>
                </div>
            </div>
        </div>
        <div class="flex-1 bg-white">
            <iframe title="App Content" srcdoc={code} frameborder="0" width="100%" height="100%"></iframe>
        </div>
    </div>
{/if}

<style>
    .window {
        position: absolute;
        top: 33%;
        left: 35%;
        resize: both;
        overflow: auto;
        z-index: 9;
    }

    [id$="header"] {
        cursor: move;
        z-index: 10;
    }

    .button-right {
        height: 2rem;
        width: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .button-right > span {
        font-size: 1.6rem;
        font-weight: 100;
    }
</style>
