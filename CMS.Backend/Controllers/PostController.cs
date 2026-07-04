

//Họ và tên: Trần Minh Vũ
//Mssv: 2122110359
//Ngày tạo: 18/5/2026 22:16
//Version: 1.0
using CMS.Data; // Quan trọng: Phải có dòng này để dùng ApplicationDbContext
using CMS.Data.Entities; // Quan trọng: Phải có dòng này để dùng lớp Post
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
namespace CMS.Backend.Controllers
{
    [Authorize] // Bắt buộc phải đăng nhập mới được vào các hàm bên dưới
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public PostController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }
        // Hàm Index: Hiển thị danh sách bài viết mẫu
        public IActionResult Index(int? id)
        {
            var query = _context.Posts
                .Include(p => p.Category)
                .OrderByDescending(p => p.CreatedDate)
                .AsQueryable();

            if (id.HasValue)
            {
                query = query.Where(p => p.CategoryId == id.Value);
            }

            return View(query.ToList());
        }

        // Hàm Details: Hiển thị chi tiết một bài viết (Bổ sung  khá giỏi)
        public IActionResult Details(int id)
        {
            // 1. Truy vấn bài viết theo ID
            // Sử dụng .Include(p => p.Category) để lấy kèm thông tin Danh mục (Join bảng)
            var post = _context.Posts
                .Include(p => p.Category)
                .FirstOrDefault(p => p.Id == id);

            // 2. Kiểm tra nếu không tìm thấy bài viết (tránh lỗi màn hình trắng)
            if (post == null)
            {
                return NotFound(); // Trả về trang lỗi 404
            }

            // 3. Truyền dữ liệu sang View
            return View(post);
        }
        // 1. Hàm hiển thị form tạo mới bài viết (GET)
        [HttpGet]
        public IActionResult Create()
        {
            // Chúng ta lấy danh sách Category để đổ vào ViewBag
            ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name");
            return View();
        }



        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Post model, IFormFile? uploadImage)
        {
            // Xóa lỗi validation của navigation property (không được bind từ form)
            ModelState.Remove("Category");

            // Xử lý upload ảnh nếu người dùng chọn file
            if (uploadImage != null && uploadImage.Length > 0)
            {
                try
                {
                    // Tạo tên file duy nhất để không bị đè dữ liệu
                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);

                    // Đảm bảo thư mục images tồn tại trước khi lưu file (hỗ trợ fallback nếu WebRootPath null)
                    var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
                    string imageFolder = Path.Combine(webRoot, "images");
                    if (!Directory.Exists(imageFolder))
                    {
                        Directory.CreateDirectory(imageFolder);
                    }

                    string filePath = Path.Combine(imageFolder, fileName);

                    // Chép file vào thư mục
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        uploadImage.CopyTo(stream);
                    }

                    // Lưu đường dẫn vào CSDL để sau này hiển thị
                    model.ImageUrl = "/images/" + fileName;
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("", "Lỗi khi upload ảnh: " + ex.Message);
                    ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name");
                    return View(model);
                }
            }

            try
            {
                _context.Posts.Add(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", "Lỗi khi lưu dữ liệu: " + ex.Message);
                ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name");
                return View(model);
            }
        }
        //Chức năng xóa bài viết
        public IActionResult Delete(int id)
        {
            // 1. Tìm bài viết theo Id
            var post = _context.Posts.Find(id);

            if (post != null)
            {
                // 2. Xóa khỏi bộ nhớ tạm
                _context.Posts.Remove(post);

                // 3. Cập nhật xuống SQL Server
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
        //Chức năng sửa bài viết
        // GET: Hiển thị form kèm dữ liệu cũ
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var post = _context.Posts.Find(id);
            if (post == null) return NotFound();

            // Chuẩn bị lại danh sách danh mục để người dùng có thể đổi chuyên mục
            ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name", post.CategoryId);
            return View(post);
        }

        // POST: Thực hiện cập nhật
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(Post model, IFormFile? uploadImage)
        {
            // Xóa lỗi validation của navigation property (không được bind từ form)
            ModelState.Remove("Category");

            // Bước 1: Kiểm tra xem người dùng có chọn file ảnh mới không
            if (uploadImage != null && uploadImage.Length > 0)
            {
                try
                {
                    // Tạo tên file duy nhất
                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);

                    // Đảm bảo thư mục images tồn tại trước khi lưu file (hỗ trợ fallback nếu WebRootPath null)
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

                    // Cập nhật đường dẫn ảnh mới vào model
                    model.ImageUrl = "/images/" + fileName;
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("", "Lỗi khi upload ảnh: " + ex.Message);
                    ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name");
                    return View(model);
                }
            }
            else
            {
                // Bước quan trọng: Nếu không upload ảnh mới, chúng ta phải giữ lại ảnh cũ
                // Chúng ta cần lấy lại giá trị ImageUrl từ Database để tránh bị ghi đè thành rỗng
                var oldPost = _context.Posts.AsNoTracking().FirstOrDefault(p => p.Id == model.Id);
                if (oldPost != null && string.IsNullOrEmpty(model.ImageUrl))
                {
                    model.ImageUrl = oldPost.ImageUrl;
                }
            }

            try
            {
                _context.Posts.Update(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", "Lỗi khi cập nhật dữ liệu: " + ex.Message);
                ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name");
                return View(model);
            }
        }

        // API Upload ảnh cho CKEditor (Chèn hình ảnh trực tiếp vào nội dung bài viết)
        [HttpPost]
        [Route("/api/upload-image")]
        public async Task<IActionResult> UploadImage(IFormFile upload)
        {
            if (upload == null || upload.Length == 0)
            {
                return BadRequest(new { error = new { message = "Không có file ảnh nào được gửi lên" } });
            }

            try
            {
                // Tạo tên file duy nhất để không bị đè dữ liệu
                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(upload.FileName);

                // Đảm bảo thư mục images tồn tại
                var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
                string imageFolder = Path.Combine(webRoot, "images");
                if (!Directory.Exists(imageFolder))
                {
                    Directory.CreateDirectory(imageFolder);
                }

                string filePath = Path.Combine(imageFolder, fileName);

                // Chép file vào thư mục
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await upload.CopyToAsync(stream);
                }

                // Trả về URL ảnh theo chuẩn CKEditor 5 SimpleUploadAdapter
                string imageUrl = "/images/" + fileName;
                return Ok(new { url = imageUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = new { message = "Lỗi khi upload ảnh: " + ex.Message } });
            }
        }


    }

}
