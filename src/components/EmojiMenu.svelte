<script lang="ts">
	import Emoji from './Emoji.svelte';
	import { insertAtCursor } from '../utils/dom';
	import { EMOJIS, EMOJI_PROMPT } from '../config';
	import type { IEmoji } from './../types';
	import { getConfig } from '../content_script'
	import EmojiDropdown from './EmojiDropdown.svelte';	

	$: recentlyUsedEmojis = getConfig().RECENTLY_USED_EMOJIS as string[];
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
    .mbpp { 
		&-dropdownBtn {
			height: 30px;
			padding: 0;

			img {
				transition: transform 150ms .05s ease-in;
			}
		}

		&-emojiMenu {
        	position: relative;
    	}
	}
</style>

<div class="mbpp mbpp-emojiMenu">
    {#each recentlyUsedEmojis as emojiKey }
        <Emoji emoji={{ name: emojiKey, src: EMOJIS[emojiKey]?.asset, categories: EMOJIS[emojiKey]?.categories }} onClick={handleOnClick} disableRecent />
    {/each}
    <a class='button mbpp-dropdownBtn' on:click={handleDropdownToggle}>
		<img class='{menuVisible ? 'rotate' : ''}' alt="dropdown-icon" src={chrome.runtime.getURL('build/assets/arrow-down.svg')} />
	</a>
	{#if menuVisible } 
		<EmojiDropdown onChoosen={handleOnClick} onBackdropClick={handleDropdownToggle} />
	{/if}
</div>
