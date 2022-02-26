<script lang="ts">
	import Emoji from './Emoji.svelte';
	import { insertAtCursor } from '../utils/dom';
	import { EMOJI_PROMPT } from '../config';
	import type { IEmoji } from './../types';
	import EmojiDropdown from './EmojiDropdown.svelte';

	$: recentlyUsedEmojis = JSON.parse(localStorage.getItem('MIKROBLOG_RECENTLY_USED_EMOJIS')) as IEmoji[];
	$: menuVisible = false;

	const injectEmoji = (emoji: IEmoji, formHandler: Element) => {
		const commentInput: HTMLTextAreaElement = formHandler.querySelector('textarea');
		insertAtCursor(commentInput, `${EMOJI_PROMPT}${emoji.name}`);

	}

	const handleOnClick = (emoji: IEmoji): void => {
		const formElem: Element = document.querySelector('form[data-submitflag="commentSubmit"]') || document.querySelector('form[data-submitflag="pmSubmit"]');
		injectEmoji(emoji, formElem)
	}

	const handleDropdownToggle = (): void => {
		menuVisible = !menuVisible
	}
</script>

<style type="text/scss">
    .emojiMenu {
        position: relative;
    }
</style>

<div class="emojiMenu">
    {#each recentlyUsedEmojis as emoji }
        <Emoji emoji={{ name: emoji.name, src: emoji.src }} onClick={handleOnClick} disableRecent />
    {/each}
    <a class="button" on:click={handleDropdownToggle}>\/</a>
	{#if menuVisible } 
		<EmojiDropdown onChoosen={handleOnClick}/>
	{/if}
</div>
