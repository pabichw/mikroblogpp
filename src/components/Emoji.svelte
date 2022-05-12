<script lang="ts">
    import type { IEmoji } from "../types";
    import { getConfig, setConfig } from '../content_script';

    export let emoji: IEmoji;
    export let disableRecent: Boolean | undefined;
    export let onClick: (e: IEmoji) => void; 

    const handleOnClick = (e: Event): void => {
        e.preventDefault();

        if (!disableRecent) {
            let recentlyUsedEmojis = getConfig()['RECENTLY_USED_EMOJIS'] as string[];
            recentlyUsedEmojis = recentlyUsedEmojis.filter(k => k !== emoji.name);
            recentlyUsedEmojis.unshift(emoji.name);
            recentlyUsedEmojis = recentlyUsedEmojis.slice(0,10);

            setConfig('RECENTLY_USED_EMOJIS', recentlyUsedEmojis);
        }
        onClick(emoji);
    }
</script>

<style type="text/scss">
    .emoji {
        display: inline-block;
        height: 30px;
        margin-right: 1px;
        padding: 0;
        padding-top: 3px;
        position: relative;
        width: 30px;

        img {
            height: 20px;
        }
    }
</style>

<a class="emoji button" on:click={handleOnClick} href="#">
    <img src={chrome.runtime.getURL(emoji.src)} alt={emoji.name} title={emoji.name} />
</a>