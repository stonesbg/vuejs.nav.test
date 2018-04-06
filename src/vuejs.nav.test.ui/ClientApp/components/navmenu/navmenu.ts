import Vue from "vue";
import { Component } from "vue-property-decorator";
import NavMenuItemComponent from "../navmenuitem/navmenuitem.vue"

@Component({
  components: {
    'navmenuitem-component': NavMenuItemComponent
  }
})
export default class NavMenuComponent extends Vue {
  menuCollapsed = false;
  nav = new Array<INavItem>();

  mounted() {
    let json = '[{"id":1,"name":"WFO Links","description":"All the links for the Workforce Optmization Suite","type":2,"subNavItems":null,"priority":2},{"id":4,"name":"Application","description":"All the links for the Application Sub Group","type":3,"subNavItems":[{"id":2,"name":"Schedule Trades","description":"Link for Schedule Trades","type":1,"subNavItems":null,"priority":2},{"id":3,"name":"Awards","description":"Link for Awards","type":1,"subNavItems":null,"priority":2}],"priority":2},{"id":6,"name":"Data","description":"Links for Data","type":3,"subNavItems":null,"priority":2},{"id":8,"name":"Favorites","description":"Link for Schedule Trades","type":2,"subNavItems":[{"id":2,"name":"Schedule Trades","description":"Link for Schedule Trades","type":1,"subNavItems":null,"priority":2},{"id":5,"name":"Reports","description":"Link for Schedule Trades","type":3,"subNavItems":null,"priority":2},{"id":7,"name":"Coaching","description":"Link for Schedule Trades","type":1,"subNavItems":null,"priority":2}],"priority":1}]';

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

  selectItem(navItem: INavItem){
    alert(navItem.title);
  }

  getType(typeId:number){
    let typeString = NavItemType[typeId];

    return typeString != undefined ? typeString.toLowerCase():'';
  }

  toggleNav() {
    this.menuCollapsed = !this.menuCollapsed;
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

export class NavItem implements INavItem {
  constructor(source: any) {
    this.id = source.id;
    this.type = source.type;
    this.title = source.name;
    this.description = source.description;
    //this.link = source.link | null
    this.priority = source.priority;
    var subNavItems = source.subNavItems as Array<any>;
    if (subNavItems != undefined) {
      this.subnavitem = new Array<INavItem>();
      subNavItems.forEach(item => {
        if(this.subnavitem != undefined){
          this.subnavitem.push(new NavItem(item));
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
  subnavitem?: Array<INavItem>;
}
