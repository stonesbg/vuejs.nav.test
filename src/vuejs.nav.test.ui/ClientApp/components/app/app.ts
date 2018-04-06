import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import NavMenuItemComponent from "../navmenuitem/navmenuitem.vue"

@Component({
    components: {
        MenuComponent: require('../navmenu/navmenu.vue.html').default,
        'navmenuitem-component': NavMenuItemComponent
    }
})
export default class AppComponent extends Vue {
}
