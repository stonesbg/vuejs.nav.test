import Vue from "vue";
import { Component } from "vue-property-decorator";
import NavMenuItemComponent from "../navmenuitem/navmenuitem.vue"

import "./navmenu.scss"

@Component({
    components: { 'nav-menu': NavMenuItemComponent }
})
export default class NavMenuComponent extends Vue {
    menuExpanded = false;
    nav = new Array<INavItem>();

    mounted() {
        let json = '[{"id":1,"name":"WFO Links","description":"All the links for the Workforce Optmization Suite","type":2,"navItems":null,"priority":2},{"id":4,"name":"Application","description":"All the links for the Application Sub Group","type":3,"navItems":[{"id":2,"name":"Schedule Trades","description":"Link for Schedule Trades","type":1,"navItems":null,"priority":2},{"id":3,"name":"Awards","description":"Link for Awards","type":1,"navItems":null,"priority":2}],"priority":2},{"id":6,"name":"Data","description":"Links for Data","type":3,"navItems":null,"priority":2},{"id":8,"name":"Favorites","description":"Link for Schedule Trades","type":2,"navItems":[{"id":2,"name":"Schedule Trades","description":"Link for Schedule Trades","type":1,"navItems":null,"priority":2},{"id":5,"name":"Reports","description":"Link for Schedule Trades","type":3,"navItems":null,"priority":2},{"id":7,"name":"Coaching","description":"Link for Schedule Trades","type":1,"navItems":null,"priority":2}],"priority":1}]';

        this.load(json);
    }

    // COMPUTED

    load(json: string) {
        let navItems: Array<INavItem> = JSON.parse(json);
        this.nav = new Array<INavItem>();
        navItems.forEach(navItem => {
            this.nav.push(new NavItem(navItem));
        });
    }

    selectItem(navItem: INavItem) {
        alert(navItem.title);
    }

    getType(typeId: number) {
        let typeString = NavItemType[typeId];

        return typeString != undefined ? typeString.toLowerCase() : '';
    }

    toggleNav() {
        this.menuExpanded = !this.menuExpanded;
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

export class NavItem implements INavItem {
    constructor(source: any) {
        this.id = source.id;
        this.type = source.type;
        this.title = source.name;
        this.description = source.description;
        //this.link = source.link | null
        this.priority = source.priority;
        var navItems = source.navItems as Array<any>;
        if (navItems != undefined) {
            this.navItems = new Array<INavItem>();
            navItems.forEach(item => {
                if (this.navItems != undefined) {
                    this.navItems.push(new NavItem(item));
                }
            });
        }
    }

    id: number;
    type: NavItemType;
    title: string;
    description: string;
    link?: string;
    priority: number;
    navItems?: Array<INavItem>;
}
