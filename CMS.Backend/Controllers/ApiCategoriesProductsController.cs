
//H? và tên: Trần Minh Vũ
//Mssv: 2122110359
//Ngày tạo: 12/6/2026
//Version: 1.0
//Tạo mới CategoriesProductsController API để cung cấp dữ liệu bài viết cho Frontend (ReactJS)
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data; 
using CMS.Data.Entities;
using System.Linq;

namespace CMS.Backend.Controllers
{
    // 1. Cấu hình đường dẫn API: api/ApiCategoriesProducts
    [Route("api/[controller]")]

    // 2. Kích hoạt tính năng tự động kiểm tra lỗi dữ liệu (Validation)
    [ApiController]

    // 3. Kế thừa ControllerBase để tối ưu bộ nhớ cho API thuần dữ liệu JSON
    public class ApiCategoriesProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // 4. Hàm khởi tạo: Nạp cơ sở dữ liệu SQL Server vào Controller thông qua DI
        public ApiCategoriesProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// API lấy toàn bộ danh mục sản phẩm thời trang (Giao thức GET)
        /// Đường dẫn gọi dữ liệu: GET https://localhost:xxxx/api/CategoriesProducts
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                // Bước A: Quét bảng dữ liệu CategoriesProducts số nhiều dưới SQL Server lên
                var categories = await _context.CategoriesProducts
                    .OrderBy(c => c.DisplayOrder) // Ưu tiên sắp xếp theo thứ tự hiển thị
                       .Select(c => new {
                        // Bước B: Kỹ thuật gọt tỉa (Projection) - chỉ lấy các trường cần thiết ra FrontEnd
                        c.Id,
                        c.Name,
                        c.Description,
                        c.DisplayOrder,
                        c.IsActive,
                        c.ImageUrl
                    })
                    .ToListAsync(); // Chuyển đổi bất đồng bộ sang dạng danh sách mảng

            // Bước C: Trả về mã thành công HTTP 200 OK đính kèm chuỗi chữ JSON sạch
            return Ok(categories);
        }
            catch (System.Exception ex)
            {
                // Bảo vệ hệ thống: Nếu sập kết nối SQL thì trả về lỗi 500 kèm lời nhắn lý do lỗi
                return StatusCode(500, new { 
                    message = "Lỗi kết nối cơ sở dữ liệu hệ thống", 
                    detail = ex.Message
    });
            }
        }

        // GET: api/ApiCategoriesProducts/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            try
            {
                var category = await _context.CategoriesProducts.FindAsync(id);
                if (category == null)
                {
                    return NotFound(new { message = "Không tìm thấy danh mục sản phẩm này" });
                }
                return Ok(category);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống", detail = ex.Message });
            }
        }

        // POST: api/ApiCategoriesProducts
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CategoryProduct category)
        {
            if (category == null)
            {
                return BadRequest(new { message = "Dữ liệu không hợp lệ" });
            }

            try
            {
                _context.CategoriesProducts.Add(category);
                await _context.SaveChangesAsync();
                return StatusCode(201, category);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi tạo danh mục", detail = ex.Message });
            }
        }

        // PUT: api/ApiCategoriesProducts/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CategoryProduct input)
        {
            if (input == null || id != input.Id)
            {
                return BadRequest(new { message = "ID danh mục không khớp" });
            }

            try
            {
                var category = await _context.CategoriesProducts.FindAsync(id);
                if (category == null)
                {
                    return NotFound(new { message = "Không tìm thấy danh mục sản phẩm" });
                }

                category.Name = input.Name;
                category.Description = input.Description;
                category.DisplayOrder = input.DisplayOrder;
                category.IsActive = input.IsActive;

                await _context.SaveChangesAsync();
                return Ok(category);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi cập nhật danh mục", detail = ex.Message });
            }
        }

        // DELETE: api/ApiCategoriesProducts/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var category = await _context.CategoriesProducts.FindAsync(id);
                if (category == null)
                {
                    return NotFound(new { message = "Không tìm thấy danh mục sản phẩm" });
                }

                _context.CategoriesProducts.Remove(category);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Xóa danh mục sản phẩm thành công" });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi xóa danh mục", detail = ex.Message });
            }
        }
    }
}
