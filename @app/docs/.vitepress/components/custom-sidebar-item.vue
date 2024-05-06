<script setup lang="ts">
import { type FunctionalComponent, computed } from "vue";
import type { DefaultTheme } from "vitepress/theme";

import VPLink from "vitepress/dist/client/theme-default/components/VPLink.vue";
import VPSidebarItem from "vitepress/dist/client/theme-default/components/VPSidebarItem.vue";

import { useSidebarControl } from "vitepress/dist/client/theme-default/composables/sidebar.js";
import { TechEnum } from "../enums/tech-enum";
import TablerBrandVue from "~icons/tabler/brand-vue";
import TablerBrandNuxt from "~icons/tabler/brand-nuxt";
import TablerBrandJavascript from "~icons/tabler/brand-javascript";
import TablerBrandVite from "~icons/tabler/brand-vite";
import TablerBrandCodepen from "~icons/tabler/brand-codepen";
import TablerBrandTypescript from "~icons/tabler/brand-typescript";
import TablerBrandCss from "~icons/tabler/brand-css3";

const props = defineProps<{
  item: DefaultTheme.SidebarItem;
  depth: number;
}>();

const {
  collapsed,
  collapsible,
  isLink,
  isActiveLink,
  hasActiveLink,
  hasChildren,
  toggle,
} = useSidebarControl(computed(() => props.item));

const techMap: Record<
  TechEnum,
  {
    icon: FunctionalComponent;
    iconStyle: Record<string, string>;
  }
> = {
  [TechEnum.CSS]: {
    icon: TablerBrandCss,
    iconStyle: {
      fontSize: "1.1em",
      color: "#2965f1",
    },
  },
  [TechEnum.VUE]: {
    icon: TablerBrandVue,
    iconStyle: {
      fontSize: "1.1em",
      color: "#4FC08D",
    },
  },
  [TechEnum.NUXT]: {
    icon: TablerBrandNuxt,
    iconStyle: {
      fontSize: "1.1em",
      color: "#00C58E",
    },
  },
  [TechEnum.VANILLA]: {
    icon: TablerBrandJavascript,
    iconStyle: {
      fontSize: "1.1em",
      color: "#F0DB4F",
    },
  },
  [TechEnum.TYPESCRIPT]: {
    icon: TablerBrandTypescript,
    iconStyle: {
      fontSize: "1.1em",
      color: "#3178C6",
    },
  },
  [TechEnum.VITE]: {
    icon: TablerBrandVite,
    iconStyle: {
      fontSize: "1.1em",
      color: "#646CFF",
    },
  },
  [TechEnum.OTHERS]: {
    icon: TablerBrandCodepen,
    iconStyle: {
      fontSize: "1.1em",
      color: "#444",
    },
  },
};

function getTechIconComponent(folderName: string) {
  const tech = Object.entries(techMap).find(([key]) => {
    return folderName.toLowerCase().includes(key.toLowerCase());
  })?.[1];

  return tech?.icon || "div";
}
function getTechIconStyle(folderName: string) {
  const tech = Object.entries(techMap).find(([key]) => {
    return folderName.toLowerCase().includes(key.toLowerCase());
  })?.[1];

  return tech?.iconStyle || {};
}

const sectionTag = computed(() => (hasChildren.value ? "section" : `div`));

const linkTag = computed(() => (isLink.value ? "a" : "div"));

const textTag = computed(() => {
  return !hasChildren.value
    ? "p"
    : props.depth + 2 === 7
      ? "p"
      : `h${props.depth + 2}`;
});

const itemRole = computed(() => (isLink.value ? undefined : "button"));

const classes = computed(() => [
  [`level-${props.depth}`],
  { collapsible: collapsible.value },
  { collapsed: collapsed.value },
  { "is-link": isLink.value },
  { "is-active": isActiveLink.value },
  { "has-active": hasActiveLink.value },
]);

function onItemInteraction(e: MouseEvent | Event) {
  if ("key" in e && e.key !== "Enter") return;

  !props.item.link && toggle();
}

function onCaretClick() {
  props.item.link && toggle();
}
</script>

<template>
  <component :is="sectionTag" class="VPSidebarItem" :class="classes">
    <div
      v-if="item.text"
      class="item"
      :role="itemRole"
      :tabindex="item.items && 0"
      v-on="
        item.items
          ? { click: onItemInteraction, keydown: onItemInteraction }
          : {}
      "
    >
      <div class="indicator" />

      <VPLink
        v-if="item.link"
        :tag="linkTag"
        class="link"
        :href="item.link"
        :rel="item.rel"
        :target="item.target"
      >
        <!-- eslint-disable-next-line vue/no-v-text-v-html-on-component -->
        <component :is="textTag" class="text" v-html="item.text" />
      </VPLink>
      <!-- eslint-disable-next-line vue/no-v-text-v-html-on-component -->
      <!-- <component :is="textTag" v-else class="text" v-html="item.text" /> -->
      <component :is="textTag" v-else class="text">
        <div class="text__icon">
          <component
            :is="getTechIconComponent(item.text)"
            :style="getTechIconStyle(item.text)"
          />
          <span v-html="item.text" />
        </div>
      </component>

      <div
        v-if="item.collapsed != null && item.items && item.items.length"
        class="caret"
        role="button"
        aria-label="toggle section"
        tabindex="0"
        @click="onCaretClick"
        @keydown.enter="onCaretClick"
      >
        <span class="vpi-chevron-right caret-icon" />
      </div>
    </div>

    <div v-if="item.items && item.items.length" class="items">
      <template v-if="depth < 5">
        <VPSidebarItem
          v-for="i in item.items"
          :key="i.text"
          :item="i"
          :depth="depth + 1"
        />
      </template>
    </div>
  </component>
</template>

<style lang="scss" scoped>
.VPSidebarItem.level-0 {
  padding-bottom: 24px;
}

.VPSidebarItem.collapsed.level-0 {
  padding-bottom: 10px;
}

.item {
  position: relative;
  display: flex;
  width: 100%;
}

.VPSidebarItem.collapsible > .item {
  cursor: pointer;
}

.indicator {
  position: absolute;
  top: 6px;
  bottom: 6px;
  left: -17px;
  width: 2px;
  border-radius: 2px;
  transition: background-color 0.25s;
}

.VPSidebarItem.level-2.is-active > .item > .indicator,
.VPSidebarItem.level-3.is-active > .item > .indicator,
.VPSidebarItem.level-4.is-active > .item > .indicator,
.VPSidebarItem.level-5.is-active > .item > .indicator {
  background-color: var(--vp-c-brand-1);
}

.link {
  display: flex;
  flex-grow: 1;
  align-items: center;
}

.text {
  flex-grow: 1;
  padding: 4px 0;
  font-size: 14px;
  line-height: 24px;
  transition: color 0.25s;
  &__icon {
    display: flex;
    align-items: center;
    svg {
      margin-right: 4px;
    }
  }
}

.VPSidebarItem.level-0 .text {
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.VPSidebarItem.level-1 .text,
.VPSidebarItem.level-2 .text,
.VPSidebarItem.level-3 .text,
.VPSidebarItem.level-4 .text,
.VPSidebarItem.level-5 .text {
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.VPSidebarItem.level-0.is-link > .item > .link:hover .text,
.VPSidebarItem.level-1.is-link > .item > .link:hover .text,
.VPSidebarItem.level-2.is-link > .item > .link:hover .text,
.VPSidebarItem.level-3.is-link > .item > .link:hover .text,
.VPSidebarItem.level-4.is-link > .item > .link:hover .text,
.VPSidebarItem.level-5.is-link > .item > .link:hover .text {
  color: var(--vp-c-brand-1);
}

.VPSidebarItem.level-0.has-active > .item > .text,
.VPSidebarItem.level-1.has-active > .item > .text,
.VPSidebarItem.level-2.has-active > .item > .text,
.VPSidebarItem.level-3.has-active > .item > .text,
.VPSidebarItem.level-4.has-active > .item > .text,
.VPSidebarItem.level-5.has-active > .item > .text,
.VPSidebarItem.level-0.has-active > .item > .link > .text,
.VPSidebarItem.level-1.has-active > .item > .link > .text,
.VPSidebarItem.level-2.has-active > .item > .link > .text,
.VPSidebarItem.level-3.has-active > .item > .link > .text,
.VPSidebarItem.level-4.has-active > .item > .link > .text,
.VPSidebarItem.level-5.has-active > .item > .link > .text {
  color: var(--vp-c-text-1);
}

.VPSidebarItem.level-0.is-active > .item .link > .text,
.VPSidebarItem.level-1.is-active > .item .link > .text,
.VPSidebarItem.level-2.is-active > .item .link > .text,
.VPSidebarItem.level-3.is-active > .item .link > .text,
.VPSidebarItem.level-4.is-active > .item .link > .text,
.VPSidebarItem.level-5.is-active > .item .link > .text {
  color: var(--vp-c-brand-1);
}

.caret {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: -7px;
  color: var(--vp-c-text-3);
  cursor: pointer;
  transition: color 0.25s;
}

.item:hover .caret {
  color: var(--vp-c-text-2);
}

.item:hover .caret:hover {
  color: var(--vp-c-text-1);
}

.caret-icon {
  font-size: 18px;
  transition: transform 0.25s;
  transform: rotate(90deg);
}

.VPSidebarItem.collapsed .caret-icon {
  transform: rotate(0);
}

.VPSidebarItem.level-1 .items,
.VPSidebarItem.level-2 .items,
.VPSidebarItem.level-3 .items,
.VPSidebarItem.level-4 .items,
.VPSidebarItem.level-5 .items {
  padding-left: 16px;
  border-left: 1px solid var(--vp-c-divider);
}

.VPSidebarItem.collapsed .items {
  display: none;
}
</style>
