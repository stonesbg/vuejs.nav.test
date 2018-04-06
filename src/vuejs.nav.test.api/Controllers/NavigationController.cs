using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using LiteDB;

namespace vuejs.demo.api.Controllers
{
    [Route("api/[controller]")]
    public class NavigationController : Controller
    {
        public NavigationController()
        {
    //        render() {
    //            var nav:Array < INavItem.App.INavItem > = [
    //  { id: 1, type: types.App.NavItemType.header, title: "WFO Links", description: "All the links for the Workforce Optimization Suite"},
    //  { id: 2, type: types.App.NavItemType.group, title: "Application", description: "All the Application links for the Workforce Optimization Suite", subnavitem: [
    //    { id: 3, type: types.App.NavItemType.link, title: "Schedule Trades", description: "Coaching link for the Workforce Optimization Suite"},
    //    { id: 4, type: types.App.NavItemType.link, title: "Coaching", description: "Coaching link for the Workforce Optimization Suite"}
    //  ]},
    //  { id: 5, type: types.App.NavItemType.group, title: "Reports", description: "All the Reports links for the Workforce Optimization Suite"},
    //  { id: 6, type: types.App.NavItemType.group, title: "Data", description: "All the Reports links for the Workforce Optimization Suite"},
    //  { id: 7, type: types.App.NavItemType.link, title: "Coaching", description: "Coaching link for the Workforce Optimization Suite"},
    //  { id: 8, type: types.App.NavItemType.header, title: "Coaching", description: "Coaching link for the Workforce Optimization Suite"},
    //  { id: 9, type: types.App.NavItemType.link, title: "Schedule Trades", description: "Coaching link for the Workforce Optimization Suite"},
    //  { id: 10, type: types.App.NavItemType.link, title: "Coaching", description: "Coaching link for the Workforce Optimization Suite"},
    //  { id: 11, type: types.App.NavItemType.link, title: "Evaluation Report", description: "Coaching link for the Workforce Optimization Suite"},
    //  { id: 12, type: types.App.NavItemType.header, title: "Favorites", description: "Favorites",subnavitem: [
    //    { id: 13, type: types.App.NavItemType.link, title: "Schedule Trades", description: "Coaching link for the Workforce Optimization Suite"},
    //    { id: 14, type: types.App.NavItemType.link, title: "Coaching", description: "Coaching link for the Workforce Optimization Suite"},
    //    { id: 15, type: types.App.NavItemType.link, title: "Evaluation Report", description: "Coaching link for the Workforce Optimization Suite"}
    //  ]}
    //]

            using (var db = new LiteDatabase(@"navItems.db"))
            {
                db.DropCollection("navitems");

                BsonMapper.Global.Entity<NavItem>()
                    .DbRef(x => x.SubNavItems, "navitems");

                var navItems = db.GetCollection<NavItem>("navitems");
                
                var navItem1 = new NavItem {Name = "WFO Links", Description = "All the links for the Workforce Optmization Suite", Type = NavItemType.Header};
                var navItem3 = new NavItem { Name = "Schedule Trades", Description = "Link for Schedule Trades", Type = NavItemType.Link };
                var navItem4 = new NavItem { Name = "Awards", Description = "Link for Awards", Type = NavItemType.Link };

                var navItem2 = new NavItem {Name = "Application", Description = "All the links for the Application Sub Group",
                    Type = NavItemType.Group, SubNavItems = new List<NavItem>()
                    {
                        navItem3,
                        navItem4
                    }
                };

                var navItem5 = new NavItem { Name = "Reports", Description = "Link for Schedule Trades", Type = NavItemType.Group };
                var navItem6 = new NavItem { Name = "Data", Description = "Links for Data", Type = NavItemType.Group };
                var navItem7 = new NavItem { Name = "Coaching", Description = "Link for Schedule Trades", Type = NavItemType.Link };

                var navItem8 = new NavItem
                {
                    Name = "Favorites",
                    Description = "Link for Schedule Trades",
                    Type = NavItemType.Header,
                    Priority = NavItemPriority.Low,
                    SubNavItems = new List<NavItem>()
                    {
                        navItem3,
                        navItem5,
                        navItem7
                    }
                };

                navItems.Insert(navItem1);
                navItems.Insert(navItem3);
                navItems.Insert(navItem4);
                navItems.Insert(navItem2);
                navItems.Insert(navItem5);
                navItems.Insert(navItem6);
                navItems.Insert(navItem7);
                navItems.Insert(navItem8);

                // Index document using a document property
                navItems.EnsureIndex(x => x.Id);
            }
        }

        // GET api/values
        [HttpGet]
        public IActionResult Get()
        {
            using (var db = new LiteDatabase(@"navItems.db"))
            {
                var navItems = db.GetCollection<NavItem>("navitems");

                var subNavIds = navItems
                    .FindAll()
                    .Where(x => x.SubNavItems != null)
                    .SelectMany(x => x.SubNavItems)
                    .Select(x => x.Id)
                    .Distinct().ToList();

                var allNavItems = navItems
                    .Include(x => x.SubNavItems)
                    .FindAll()
                    .Where(x=> !subNavIds.Contains(x.Id));

                

                return Json(allNavItems);
            }
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            using (var db = new LiteDatabase(@"navItems.db"))
            {
                var navItems = db.GetCollection<NavItem>("navitems");
                return Json(navItems
                    .Include(x => x.SubNavItems)
                    .FindById(id));
            }
        }
    }

    public enum NavItemType
    {
        Hidden = 0,
        Link,
        Header,
        Group
    }

    public enum NavItemPriority
    {
        Lowest = 0,
        Low,
        Normal,
        High,
        Highest
    }

    public class NavItem
    {
        public NavItem() {
            Priority = NavItemPriority.Normal;
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public NavItemType Type { get; set; }
        public List<NavItem> SubNavItems { get; set; }
        public NavItemPriority Priority { get; set; }
    }
}
