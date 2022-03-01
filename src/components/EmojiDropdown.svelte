<script lang="ts">
    import { EMOJIS } from '../config/emojis';
    import Emoji from './Emoji.svelte';

    export let onChoosen: (IEmoji) => void
    export let onBackdropClick: () => void

    $: filteredEmojis = EMOJIS;
    $: categories = [...new Set(Object.entries(filteredEmojis).map(([_, value]) => (value as IEmoji).categories ).flat())];

    const handleFilterChange = ({ query }: IFilter) => {
        if (query === ' ') {
            return EMOJIS;
        }

        filteredEmojis = Object.fromEntries(Object.entries(EMOJIS).filter(([key, value]) => {
            if (key.includes(query)) {
                return true;
            } else {
                return false
            }
        }))
        console.log('filteredEmojis',filteredEmojis)
    }
</script>

<style type="text/scss">
    .mbpp { 
        &-emojisDropdown {
            position: absolute;
            top: 30px;
            width: 100%;
            height: auto;
            background: rgb(44, 44, 44);
            border-radius: 2px;
            padding: 10px 15px;
            box-shadow: black 2px 0 5px;
            z-index: 999;

            a {
                display: inline-block;
                padding: 0;
                margin-right: 4px;
                height: 30px;
                width: 30px;
                position: relative;

                img {
                    height: 22px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
            }
	    }

        &-emojiSearch {
            font-size: 11px;
            padding: .7rem .6rem;
            margin-bottom: 8px;
        }

        &-emojiList {
            max-height: 300px;
            overflow-y: auto;
            padding-right: 5px;

            .mbpp-emoji {
                margin-left: 2px;
                margin-bottom: 2px;
            }
            
            h4 {
                color: rgb(119, 119, 119);
                margin-bottom: 6px;
                margin-top: 10px;
                padding-bottom: 2px;
            }
        }
        
        &-dropdownBackdrop {
            height: 100vh;
            left: 0;
            position: fixed;
            top: 0;
            width: 100vw;
            z-index: 9;
        }
    }
</style>
<section class="mbpp mbpp-emojisDropdown notVisible">
    <input 
        class="mbpp-emojiSearch"
        placeholder="Wyszukaj..."
        type="text" 
        on:input={e => handleFilterChange({ query: e.target.value })}  
    />
    <section class="mbpp-emojiList">
        {#each categories as category}
            {#if category}
                <h4>{category}</h4> 
                {#each Object.entries(filteredEmojis) as [key, value] }
                    {#if (value.categories && value.categories.includes(category))}
                        <Emoji emoji={{ name: key, src: value.asset }} onClick={onChoosen} />
                    {/if}
                {/each}
            {/if}
        {/each}
        <h4>Inne</h4> 
        {#each Object.entries(filteredEmojis) as [key, value] }
            {#if (!value.categories)}
                <Emoji emoji={{ name: key, src: value.asset }} onClick={onChoosen} />
            {/if}
        {/each}
    </section>
</section>

<div class="mbpp-dropdownBackdrop" on:click={onBackdropClick} />