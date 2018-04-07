using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace vuejs.nav.test.ui.Controllers
{
    public class HomeController : Controller
    {
    private readonly ILogger _logger;

        public HomeController(ILogger<HomeController> logger)
        {
      _logger = logger;
        }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }
    }
}
