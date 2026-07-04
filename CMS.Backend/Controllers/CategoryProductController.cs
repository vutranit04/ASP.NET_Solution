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
    [Authorize] // bắt buộc đăng nhập
    public class CategoryProductController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public CategoryProductController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // =========================
        // INDEX - Danh sách category
        // =========================
        public IActionResult Index()
        {
            var data = _context.CategoriesProducts
                .OrderBy(x => x.DisplayOrder)
                .ToList();

            return View(data);
        }


        // =========================
        // CREATE - GET
        // =========================
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // =========================
        // CREATE - POST
        // =========================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(CategoryProduct model, IFormFile? uploadImage)
        {
            // Xử lý upload ảnh nếu người dùng chọn file
            if (uploadImage != null && uploadImage.Length > 0)
            {
                try
                {
                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                    var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
                    string imageFolder = Path.Combine(webRoot, "images");
                    if (!Directory.Exists(imageFolder))
                    {
                        Directory.CreateDirectory(imageFolder);
                    }

                    string filePath = Path.Combine(imageFolder, fileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        uploadImage.CopyTo(stream);
                    }
                    model.ImageUrl = "/images/" + fileName;
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("", "Lỗi khi upload ảnh: " + ex.Message);
                    return View(model);
                }
            }

            if (ModelState.IsValid)
            {
                _context.CategoriesProducts.Add(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(model);
        }

        // =========================
        // EDIT - GET
        // =========================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var category = _context.CategoriesProducts.Find(id);

            if (category == null)
            {
                return NotFound();
            }

            return View(category);
        }

        // =========================
        // EDIT - POST
        // =========================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(CategoryProduct model, IFormFile? uploadImage)
        {
            if (uploadImage != null && uploadImage.Length > 0)
            {
                try
                {
                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                    var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
                    string imageFolder = Path.Combine(webRoot, "images");
                    if (!Directory.Exists(imageFolder))
                    {
                        Directory.CreateDirectory(imageFolder);
                    }

                    string filePath = Path.Combine(imageFolder, fileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        uploadImage.CopyTo(stream);
                    }
                    model.ImageUrl = "/images/" + fileName;
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("", "Lỗi khi upload ảnh: " + ex.Message);
                    return View(model);
                }
            }
            else
            {
                // Giữ lại ảnh cũ nếu không tải lên ảnh mới
                var oldCategory = _context.CategoriesProducts.AsNoTracking().FirstOrDefault(c => c.Id == model.Id);
                if (oldCategory != null && string.IsNullOrEmpty(model.ImageUrl))
                {
                    model.ImageUrl = oldCategory.ImageUrl;
                }
            }

            if (ModelState.IsValid)
            {
                _context.CategoriesProducts.Update(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(model);
        }

        // =========================
        // DELETE
        // =========================
        public IActionResult Delete(int id)
        {
            var category = _context.CategoriesProducts.Find(id);

            if (category != null)
            {
                _context.CategoriesProducts.Remove(category);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}