//Họ và tên: Trần Minh Vũ
//Mssv: 2122110359
//Ngày tạo: 13/6/2026
//Version: 1.0

using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ProductController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // =========================
        // INDEX - Danh sách sản phẩm
        // =========================
        public IActionResult Index()
        {
            var data = _context.Products
                .Include(p => p.CategoryProduct)
                .OrderByDescending(p => p.Id)
                .ToList();

            return View(data);
        }

        // =========================
        // DETAILS - Chi tiết sản phẩm
        // =========================
        public IActionResult Details(int id)
        {
            var product = _context.Products
                .Include(p => p.CategoryProduct)
                .FirstOrDefault(p => p.Id == id);

            if (product == null)
            {
                return NotFound();
            }

            return View(product);
        }

        // =========================
        // CREATE - GET
        // =========================
        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.CategoryList = new SelectList(
                _context.CategoriesProducts,
                "Id",
                "Name"
            );

            return View();
        }

        // =========================
        // CREATE - POST
        // =========================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Product model, IFormFile? ImageFile)
        {
            if (ModelState.IsValid)
            {
                // Xử lý upload ảnh nếu người dùng chọn file
                if (ImageFile != null && ImageFile.Length > 0)
                {
                    // Tạo tên file duy nhất để tránh trùng lặp
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(ImageFile.FileName);
                    var filePath = Path.Combine(_env.WebRootPath, "images", fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        ImageFile.CopyTo(stream);
                    }

                    // Lưu đường dẫn tương đối vào Database
                    model.ImageUrl = "/images/" + fileName;
                }

                _context.Products.Add(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.CategoryList = new SelectList(_context.CategoriesProducts, "Id", "Name");
            return View(model);
        }

        // =========================
        // EDIT - GET
        // =========================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var product = _context.Products.Find(id);

            if (product == null)
            {
                return NotFound();
            }

            ViewBag.CategoryList = new SelectList(
                _context.CategoriesProducts,
                "Id",
                "Name",
                product.CategoryProductId
            );

            return View(product);
        }

        // =========================
        // EDIT - POST
        // =========================
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public IActionResult Edit(Product model, IFormFile? ImageFile)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        // Xử lý upload ảnh mới nếu người dùng chọn file
        //        if (ImageFile != null && ImageFile.Length > 0)
        //        {
        //            // Tạo tên file duy nhất để tránh trùng lặp
        //            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(ImageFile.FileName);
        //            var filePath = Path.Combine(_env.WebRootPath, "images", fileName);

        //            using (var stream = new FileStream(filePath, FileMode.Create))
        //            {
        //                ImageFile.CopyTo(stream);
        //            }

        //            // Cập nhật đường dẫn ảnh mới
        //            model.ImageUrl = "/images/" + fileName;
        //        }
        //        else
        //        {
        //            // Nếu không chọn ảnh mới, giữ lại ảnh cũ từ Database
        //            var existingProduct = _context.Products.AsNoTracking().FirstOrDefault(p => p.Id == model.Id);
        //            if (existingProduct != null)
        //            {
        //                model.ImageUrl = existingProduct.ImageUrl;
        //            }
        //        }

        //        _context.Products.Update(model);
        //        _context.SaveChanges();
        //        return RedirectToAction("Index");
        //    }

        //    ViewBag.CategoryList = new SelectList(_context.CategoriesProducts, "Id", "Name");
        //    return View(model);
        //}
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(Product model, IFormFile? ImageFile)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = string.Join("\n",
                        ModelState.Values
                            .SelectMany(v => v.Errors)
                            .Select(e => e.ErrorMessage));

                    return Content("ModelState Error:\n" + errors);
                }

                if (ImageFile != null && ImageFile.Length > 0)
                {
                    var uploadsFolder = Path.Combine(_env.WebRootPath, "images");

                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    var fileName = Guid.NewGuid().ToString()
                                   + Path.GetExtension(ImageFile.FileName);

                    var filePath = Path.Combine(uploadsFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        ImageFile.CopyTo(stream);
                    }

                    model.ImageUrl = "/images/" + fileName;
                }
                else
                {
                    var existingProduct = _context.Products
                        .AsNoTracking()
                        .FirstOrDefault(p => p.Id == model.Id);

                    if (existingProduct != null)
                    {
                        model.ImageUrl = existingProduct.ImageUrl;
                    }
                }

                _context.Products.Update(model);
                _context.SaveChanges();

                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                return Content(ex.ToString());
            }
        }
        // =========================
        // DELETE
        // =========================
        public IActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);

            if (product != null)
            {
                _context.Products.Remove(product);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}