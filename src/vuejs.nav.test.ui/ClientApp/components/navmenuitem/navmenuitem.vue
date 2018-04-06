<template>
    <div v-if="getType(navItem.type) === 'header'">
        <li>
            <h2 className="aspect-sub-nav-heading">
                <span>{{navItem.title}}</span>
            </h2>
            <section className="aspect-nav-item2">
                <ul className="aspect-nav-sub-menu2 expanded">
                    <!-- <navmenuitem-component :navItem="navItem" /> -->
                </ul>
            </section>
        </li>
    </div>
    <div v-else-if="getType(navItem.type) === 'group'">
        <li key={navItem.id}>
            <a href="#">
                <i class="fas fa-caret-right"></i>
                <span>{{navItem.title}}</span>
                <div v-if="showRightChevron(navItem)">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </a>
        </li>
    </div>
    <div v-else-if="getType(navItem.type) === 'link'">
        <li>
            <a href="#" v-on:click="navItem.selectItem(navItem)">
                <i class="fas fa-caret-right"></i>
                <span className="myspan">{{navItem.title}}</span>
            </a>
        </li>
    </div>
    <div v-else>
        Not A/B/C
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class NavMenuItemComponent extends Vue {
  @Prop() navItem!: INavItem;

  getType(typeId:number){
    let typeString = NavItemType[typeId];

    return typeString != undefined ? typeString.toLowerCase():'';
  }

  showRightChevron(navItem: INavItem) {
    return navItem.subnavitem != undefined && navItem.subnavitem.length > 0;
  }
}

export enum NavItemType {
  hidden = 0,
  link,
  header,
  group
}

export interface INavItem {
  id: number;
  type: NavItemType;
  title: string;
  description: string;
  link?: string;
  priority: number;
  subnavitem?: Array<INavItem>;
}
</script>/>
