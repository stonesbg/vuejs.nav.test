using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using LiteDB;

namespace vuejs.demo.api.Controllers
{
    [Route("api/[controller]")]
    public class NavigationController : Controller
    {
        public NavigationController()
        {
            using (var db = new LiteDatabase(@"navItems.db"))
            {
                db.DropCollection("navitems");

                BsonMapper.Global.Entity<NavItem>()
                    .DbRef(x => x.NavItems, "navitems");

                var navItems = db.GetCollection<NavItem>("navitems");
                
                var navItem1 = new NavItem {Name = "Links", Description = "All the links for the Development Suite", Type = NavItemType.Header};
                var navItem3 = new NavItem { Name = "Reports", Description = "Link for Reports", Type = NavItemType.Link };
                var navItem4 = new NavItem { Name = "Awards", Description = "Link for Awards", Type = NavItemType.Link };

                var navItem2 = new NavItem {Name = "Application", Description = "All the links for the Application Sub Group",
                    Type = NavItemType.Group, NavItems = new List<NavItem>()
                    {
                        navItem3,
                        navItem4
                    }
                };

                var navItem5 = new NavItem { Name = "Reports 1", Description = "Link for Schedule Trades", Type = NavItemType.Group };
                var navItem6 = new NavItem { Name = "Data", Description = "Links for Data", Type = NavItemType.Group };
                var navItem7 = new NavItem { Name = "Applications", Description = "Link for Applications", Type = NavItemType.Link };

                var navItem8 = new NavItem
                {
                    Name = "Favorites",
                    Description = "Link for Favorites",
                    Type = NavItemType.Header,
                    Priority = NavItemPriority.Low,
                    NavItems = new List<NavItem>()
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
                    .Where(x => x.NavItems != null)
                    .SelectMany(x => x.NavItems)
                    .Select(x => x.Id)
                    .Distinct().ToList();

                var allNavItems = navItems
                    .Include(x => x.NavItems)
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
                    .Include(x => x.NavItems)
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
        public List<NavItem> NavItems { get; set; }
        public NavItemPriority Priority { get; set; }
    }
}
