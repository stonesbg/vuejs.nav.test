<template>
    <nav>
        <ul class="navmenu">
            <li v-for="navItem in navItems">
                <template v-if="getType(navItem.type) === 'header'">

                    <h2 className="aspect-sub-nav-heading">
                        <span>{{navItem.title}}</span>
                    </h2>
                    <section className="aspect-nav-item2">
                        <!--<ul className="aspect-nav-sub-menu2 expanded">-->
                        <nav-menu :navItems="navItem.navItems" />
                        <!--</ul>-->
                    </section>
                </template>
                <template v-else-if="getType(navItem.type) === 'group'">
                    <a href="#" key="{navItem.id}">
                        <i class="fas fa-caret-right"></i>
                        <span>{{navItem.title}}</span>
                        <div v-if="showRightChevron(navItem)">
                            <i class="fas fa-chevron-right"></i>
                        </div>
                    </a>
                </template>
                <template v-else-if="getType(navItem.type) === 'link'">
                    <a href="#" v-on:click="navItem.selectItem(navItem)">
                        <i class="fas fa-caret-right"></i>
                        <span className="myspan">{{navItem.title}}</span>
                    </a>
                </template>
                <template v-else>
                    Not A/B/C
                </template>
            </li>
        </ul>
    </nav>
</template>

<script lang="ts">
    import Vue from "vue";
    import { Component, Prop } from "vue-property-decorator";

    @Component({
        name: 'nav-menu'
    })
    export default class NavMenuItemComponent extends Vue {
        @Prop() navItems!: Array<INavItem>;

        getType(typeId: number) {
            let typeString = NavItemType[typeId];

            return typeString != undefined ? typeString.toLowerCase() : '';
        }

        showRightChevron(navItem: INavItem) {
            return navItem.navItems != undefined && navItem.navItems.length > 0;
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
        navItems?: Array<INavItem>;
    }
</script>

<style lang="scss">
</style>