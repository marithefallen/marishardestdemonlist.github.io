import { store } from "../main.js";
import { embed } from "../util.js";
import { fetchList } from "../content.js";

import Spinner from "../components/Spinner.js";
import LevelAuthors from "../components/List/LevelAuthors.js";

export default {
    components: { Spinner, LevelAuthors },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list">
            <div class="list-container">
                <table class="list" v-if="list">
                    <tr v-for="([level, err], i) in list">
                        <td class="rank">
                            <p v-if="i + 1 <= 150" class="type-label-lg">#{{ i + 1 }}</p>
                            <p v-else class="type-label-lg">Legacy</p>
                        </td>
                        <td class="level" :class="{ 'active': selected == i, 'error': !level }">
                            <button @click="selected = i">
                                <span class="type-label-lg">{{ level?.name || \`Error (\${err}.json)\` }}</span>
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="level-container">
                <div class="level" v-if="level" :key="selected">
                    <h1>{{ level.name }}</h1>
                    <LevelAuthors :author="level.author" :creators="level.creators" :verifier="level.verifier"></LevelAuthors>
                    <iframe v-if="video" class="video" id="videoframe" :src="video" frameborder="0"></iframe>
                    <div class="level-progress">
                        <div class="type-title-sm">Level Progress</div>
                        <p>{{ level['Level Progress'] || 'N/A' }}</p>
                    </div>
                    <ul class="stats">
                        <li>
                            <div class="type-title-sm">Tags</div>
                            <p>{{ level.Tags || 'N/A' }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">Attempts</div>
                            <p>{{ level.Attempts || 'N/A' }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">ID</div>
                            <p>{{ level.id }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">Difficulty Opinion</div>
                            <p>{{ level['Difficulty Opinion'] || 'N/A' }}</p>
                        </li>
                    </ul>
                </div>
                <div v-else class="level" style="height: 100%; justify-content: center; align-items: center;">
                    <p>(ノಠ益ಠ)ノ彡┻━┻</p>
                </div>
            </div>
        </main>
    `,
    data: () => ({
        list: [],
        loading: true,
        selected: 0,
        store
    }),
    computed: {
        level() {
            return this.list[this.selected][0];
        },
        video() {
            const completionVideo = this.level.verification
                || this.level["Completion Progress"]
                || this.level["Completion Video"]
                || this.level.Completion;

            if (!completionVideo || completionVideo === "N/A") {
                return "";
            }

            if (!this.level.showcase) {
                return embed(completionVideo);
            }

            return embed(
                this.toggledShowcase
                    ? this.level.showcase
                    : completionVideo
            );
        },
    },
    async mounted() {
        // Hide loading spinner
        this.list = await fetchList();

        this.loading = false;
    },
    methods: {
        embed,
    },
};
