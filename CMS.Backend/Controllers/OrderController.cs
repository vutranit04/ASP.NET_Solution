//Họ và tên: Trần Minh Vũ
//Mssv: 2122110359
//Ngày tạo: 13/6/2026
//Version: 1.0

using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =====================
        // INDEX
        // =====================
        public IActionResult Index()
        {
            var data = _context.Orders
                .Include(x => x.Customer)
                .OrderByDescending(x => x.OrderDate)
                .ToList();

            return View(data);
        }

        // =====================
        // DETAILS
        // =====================
        public IActionResult Details(int id)
        {
            var order = _context.Orders
                .Include(x => x.Customer)
                .FirstOrDefault(x => x.Id == id);

            if (order == null)
                return NotFound();

            return View(order);
        }

        // =====================
        // EDIT - GET
        // =====================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var order = _context.Orders.Find(id);

            if (order == null)
                return NotFound();

            return View(order);
        }

        // =====================
        // EDIT - POST (update status)
        // =====================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(Order model)
        {
            if (ModelState.IsValid)
            {
                _context.Orders.Update(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(model);
        }

        // =====================
        // DELETE
        // =====================
        public IActionResult Delete(int id)
        {
            var order = _context.Orders.Find(id);

            if (order != null)
            {
                _context.Orders.Remove(order);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}