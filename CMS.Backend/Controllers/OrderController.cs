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
                .Include(x => x.OrderDetails)
                    .ThenInclude(od => od.Product)
                .FirstOrDefault(x => x.Id == id);

            if (order == null)
                return NotFound();

            return View(order);
        }

        // =====================
        // UPDATE STATUS (Sửa trực tiếp trạng thái trong chi tiết đơn hàng) (YC #4)
        // =====================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult UpdateStatus(int id, int status)
        {
            var order = _context.Orders.Find(id);
            if (order != null)
            {
                order.Status = status;
                _context.SaveChanges();
            }

            return RedirectToAction("Details", new { id = id });
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