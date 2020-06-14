using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace TypescriptCoreRazorLibrary.Controllers
{
    public class TypescriptController : BaseController
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
