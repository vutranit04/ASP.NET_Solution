using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class OrderDetailController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderDetailController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =====================
        // INDEX
        // =====================
        public IActionResult Index()
        {
            var data = _context.OrderDetails
                .Include(x => x.Order)
                .Include(x => x.Product)
                .ToList();

            return View(data);
        }

        // =====================
        // DETAILS
        // =====================
        public IActionResult Details(int id)
        {
            var data = _context.OrderDetails
                .Include(x => x.Order)
                .Include(x => x.Product)
                .FirstOrDefault(x => x.Id == id);

            if (data == null)
                return NotFound();

            return View(data);
        }

        // =====================
        // CREATE - GET
        // =====================
        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.OrderList = new SelectList(_context.Orders, "Id", "Id");
            ViewBag.ProductList = new SelectList(_context.Products, "Id", "Name");

            return View();
        }

        // CREATE - POST
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(OrderDetail model)
        {
            if (ModelState.IsValid)
            {
                _context.OrderDetails.Add(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.OrderList = new SelectList(_context.Orders, "Id", "Id");
            ViewBag.ProductList = new SelectList(_context.Products, "Id", "Name");

            return View(model);
        }

        // =====================
        // EDIT - GET
        // =====================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var data = _context.OrderDetails.Find(id);

            if (data == null)
                return NotFound();

            ViewBag.OrderList = new SelectList(_context.Orders, "Id", "Id", data.OrderId);
            ViewBag.ProductList = new SelectList(_context.Products, "Id", "Name", data.ProductId);

            return View(data);
        }

        // EDIT - POST
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(OrderDetail model)
        {
            if (ModelState.IsValid)
            {
                _context.OrderDetails.Update(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.OrderList = new SelectList(_context.Orders, "Id", "Id");
            ViewBag.ProductList = new SelectList(_context.Products, "Id", "Name");

            return View(model);
        }

        // =====================
        // DELETE
        // =====================
        public IActionResult Delete(int id)
        {
            var data = _context.OrderDetails.Find(id);

            if (data != null)
            {
                _context.OrderDetails.Remove(data);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}