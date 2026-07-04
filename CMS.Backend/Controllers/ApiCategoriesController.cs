//Họ và tên: Trần Minh Vũ
//Mssv: 2122110359
//Ngày tạo: 26/6/2026
//Version: 1.0
//Tạo mới ApiCategoriesController để cung cấp dữ liệu danh mục bài viết cho Frontend (ReactJS)
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.Threading.Tasks;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApiCategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ApiCategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// API lấy toàn bộ danh mục bài viết (Giao thức GET)
        /// Đường dẫn gọi dữ liệu: GET https://localhost:xxxx/api/ApiCategories
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var categories = await _context.Categories
                    .Select(c => new {
                        c.Id,
                        c.Name,
                        c.Description
                    })
                    .ToListAsync();

                return Ok(categories);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { 
                    message = "Lỗi kết nối cơ sở dữ liệu hệ thống", 
                    detail = ex.Message
                });
            }
        }

        // GET: api/ApiCategories/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            try
            {
                var category = await _context.Categories.FindAsync(id);
                if (category == null)
                {
                    return NotFound(new { message = "Không tìm thấy danh mục bài viết này" });
                }
                return Ok(new
                {
                    category.Id,
                    category.Name,
                    category.Description
                });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống", detail = ex.Message });
            }
        }

        // POST: api/ApiCategories
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Category category)
        {
            if (category == null)
            {
                return BadRequest(new { message = "Dữ liệu không hợp lệ" });
            }

            try
            {
                _context.Categories.Add(category);
                await _context.SaveChangesAsync();
                return StatusCode(201, category);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi tạo danh mục bài viết", detail = ex.Message });
            }
        }

        // PUT: api/ApiCategories/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Category input)
        {
            if (input == null || id != input.Id)
            {
                return BadRequest(new { message = "ID danh mục không khớp" });
            }

            try
            {
                var category = await _context.Categories.FindAsync(id);
                if (category == null)
                {
                    return NotFound(new { message = "Không tìm thấy danh mục bài viết" });
                }

                category.Name = input.Name;
                category.Description = input.Description;

                await _context.SaveChangesAsync();
                return Ok(category);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi cập nhật danh mục bài viết", detail = ex.Message });
            }
        }

        // DELETE: api/ApiCategories/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var category = await _context.Categories.FindAsync(id);
                if (category == null)
                {
                    return NotFound(new { message = "Không tìm thấy danh mục bài viết" });
                }

                _context.Categories.Remove(category);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Xóa danh mục bài viết thành công" });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi xóa danh mục bài viết", detail = ex.Message });
            }
        }
    }
}
