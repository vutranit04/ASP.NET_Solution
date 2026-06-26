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
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =====================
        // INDEX
        // =====================
        public IActionResult Index()
        {
            var data = _context.Customers
                .OrderByDescending(x => x.Id)
                .ToList();

            return View(data);
        }

        // =====================
        // DETAILS
        // =====================
        public IActionResult Details(int id)
        {
            var customer = _context.Customers
                .Include(x => x.Orders)
                .FirstOrDefault(x => x.Id == id);

            if (customer == null)
                return NotFound();

            return View(customer);
        }

        // =====================
        // CREATE - GET
        // =====================
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // CREATE - POST
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Customer model)
        {
            if (ModelState.IsValid)
            {
                _context.Customers.Add(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(model);
        }

        // =====================
        // EDIT - GET
        // =====================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var customer = _context.Customers.Find(id);

            if (customer == null)
                return NotFound();

            return View(customer);
        }

        // EDIT - POST
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(Customer model)
        {
            if (ModelState.IsValid)
            {
                _context.Customers.Update(model);
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
            var customer = _context.Customers.Find(id);

            if (customer != null)
            {
                _context.Customers.Remove(customer);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}