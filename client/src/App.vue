<template>
  <div>
    <h1>{{ feedTitle }}</h1>
    <div v-for="item in currentItems">
      <h2>{{ item.title }}</h2>
      <p>{{ item.pubDate }}</p>
      <p>{{ item.description }}</p>
      <p><a :target="_blank" :href="item.link">Read more</a></p>
    </div>
    <div>
      <button @click="paginate(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
      <button @click="paginate(currentPage + 1)" :disabled="currentPage === numberOfPages">Next</button>
      <button @click="reload">Reload</button>
      <p>Page {{ currentPage }} of {{ numberOfPages }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      feedTitle: "",
      feedItems: [],
      currentPage: 1,
      itemsPerPage: 4,
    };
  },
  computed: {
    numberOfPages() {
      return Math.ceil(this.feedItems.length / this.itemsPerPage);
    },
    currentItems() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      return this.feedItems.slice(startIndex, startIndex + this.itemsPerPage);
    },
  },
  created() {
    this.fetchFeed();
  },
  methods: {
    async fetchFeed() {
      try {
        const response = await axios.get("http://localhost:5175/rss");
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, "text/xml");
        const channel = xmlDoc.getElementsByTagName("channel")[0];
        this.feedTitle = channel.getElementsByTagName("title")[0].textContent;
        const items = xmlDoc.getElementsByTagName("item");
        for (let i = 0; i < items.length; i++) {
          this.feedItems.push({
            title: items[i].getElementsByTagName("title")[0].textContent,
            description: items[i].getElementsByTagName("description")[0].textContent,
            link: items[i].getElementsByTagName("guid")[0].textContent,
            pubDate: items[i].getElementsByTagName("pubDate")[0].textContent,
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    paginate(page) {
      this.currentPage = page;
    },
    reload() {
      this.feedTitle = "";
      this.feedItems = [];
      this.currentPage = 1;
      this.fetchFeed();
    },
  },
};
</script>
