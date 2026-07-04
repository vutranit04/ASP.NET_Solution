
//H? và tên: Trần Minh Vũ
//Mssv: 2122110359
//Ngày tạo: 12/6/2026
//Version: 1.0
//Tạo mới ProductsController API để cung cấp dữ liệu sản phẩm cho Frontend (ReactJS)    
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    // 1. Định nghĩa đường dẫn để gọi API. [controller] sẽ tự lấy tên là "Categories"
    // Khi chạy, địa chỉ truy cập dữ liệu sẽ là: https://localhost:xxxx/api/categories
    [Route("api/[controller]")]

    // 2. Đánh dấu đây là một API Controller để hệ thống hỗ trợ các tính năng tự động kiểm tra dữ liệu đầu vào
    [ApiController]

    // 3. API Controller phải kế thừa từ ControllerBase (thay vì kế thừa từ Controller như phân hệ MVC)
    public class ApiProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // 4. Hàm khởi tạo (Constructor): "Tiêm" ngữ cảnh dữ liệu SQL Server vào để sử dụng
        public ApiProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. Chỉ định phương thức GET (Dùng để kéo dữ liệu từ cơ sở dữ liệu, hỗ trợ tìm kiếm bằng từ khóa và lọc giá)
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] decimal? minPrice, [FromQuery] decimal? maxPrice)
        {
            var query = _context.Products.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p => p.Name.Contains(search) || (p.Description != null && p.Description.Contains(search)));
            }

            // Lọc theo khoảng giá (YC #39)
            if (minPrice.HasValue)
            {
                query = query.Where(p => p.Price >= minPrice.Value);
            }
            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= maxPrice.Value);
            }

            // Lấy dữ liệu từ bảng Products số nhiều trong SQL Server
            var products = await query
                .OrderByDescending(p => p.Id) // Sắp xếp sản phẩm mới nhất lên đầu
                .ToListAsync();

            // Trả về kết quả cho Frontend kèm mã trạng thái HTTP 200 OK (Thành công)
            return Ok(products);
        }

        // API lấy 3 sản phẩm MỚI NHẤT (YC #36)
        [HttpGet("latest")]
        public async Task<IActionResult> GetLatest()
        {
            var latestProducts = await _context.Products
                .OrderByDescending(p => p.Id) // Sản phẩm có Id lớn nhất = mới nhất
                .Take(3)
                .ToListAsync();

            return Ok(latestProducts);
        }

        // API lấy 3 sản phẩm BÁN CHẠY NHẤT (YC #37) - dựa trên tổng số lượng đã bán trong OrderDetails
        [HttpGet("bestselling")]
        public async Task<IActionResult> GetBestSelling()
        {
            var bestSellingProductIds = await _context.OrderDetails
                .GroupBy(od => od.ProductId)
                .Select(g => new { ProductId = g.Key, TotalSold = g.Sum(x => x.Quantity) })
                .OrderByDescending(x => x.TotalSold)
                .Take(3)
                .Select(x => x.ProductId)
                .ToListAsync();

            var bestSellingProducts = await _context.Products
                .Where(p => bestSellingProductIds.Contains(p.Id))
                .ToListAsync();

            // Sắp xếp lại theo thứ tự bán chạy
            var orderedProducts = bestSellingProductIds
                .Select(id => bestSellingProducts.FirstOrDefault(p => p.Id == id))
                .Where(p => p != null)
                .ToList();

            // Nếu chưa có đơn hàng nào, fallback lấy 3 sản phẩm đầu tiên
            if (orderedProducts.Count == 0)
            {
                orderedProducts = await _context.Products.Take(3).ToListAsync();
            }

            return Ok(orderedProducts);
        }

        // 2. Định nghĩa đường dẫn chứa tham số động: api/products/categoryproduct/{categoryproductId}
        [HttpGet("categoryproduct/{categoryProductId}")]
        public async Task<IActionResult> GetByCategoryProduct(int categoryProductId)
        {
            // Lọc các bài viết có CategoryId trùng với ID truyền vào từ thanh URL
            var products = await _context.Products
                .Where(p => p.CategoryProductId == categoryProductId)
                .ToListAsync();

            return Ok(products);
        }
        // 3. Định nghĩa đường dẫn nhận ID trực tiếp: api/products/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            // 3.1. Quét bảng Products để tìm sản phẩm đầu tiên có Id khớp với tham số
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == id);

            // 3.2 Xử lý kịch bản lỗi bảo vệ hệ thống: ID không tồn tại trong Database
            if (product == null)
            {
                // Trả về mã lỗi 404 kèm một "gói tin" JSON thông báo nhỏ gọn để Frontend tự xử lý UI
                return NotFound(new { message = "Không tìm thấy sản phẩm này trong hệ thống" });
            }

            // 3.3. Trả về toàn bộ đối tượng sản phẩm (bao gồm cả trường Content chứa mã HTML) kèm mã 200 OK
            return Ok(product);
        }

        // POST: api/ApiProducts
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Product product)
        {
            if (product == null)
            {
                return BadRequest(new { message = "Dữ liệu sản phẩm không hợp lệ" });
            }

            try
            {
                _context.Products.Add(product);
                await _context.SaveChangesAsync();
                return StatusCode(201, product);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi tạo sản phẩm", detail = ex.Message });
            }
        }

        // PUT: api/ApiProducts/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Product productInput)
        {
            if (productInput == null || id != productInput.Id)
            {
                return BadRequest(new { message = "ID sản phẩm không khớp" });
            }

            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                    return NotFound(new { message = "Không tìm thấy sản phẩm" });
                }

                product.Name = productInput.Name;
                product.Price = productInput.Price;
                product.Description = productInput.Description;
                product.ImageUrl = productInput.ImageUrl;
                product.CategoryProductId = productInput.CategoryProductId;

                await _context.SaveChangesAsync();
                return Ok(product);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi cập nhật sản phẩm", detail = ex.Message });
            }
        }

        // DELETE: api/ApiProducts/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                    return NotFound(new { message = "Không tìm thấy sản phẩm" });
                }

                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Xóa sản phẩm thành công" });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi xóa sản phẩm", detail = ex.Message });
            }
        }
    }
}
