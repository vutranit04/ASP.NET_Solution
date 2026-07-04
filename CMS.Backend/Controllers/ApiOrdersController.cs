
//Họ và tên: Trần Minh Vũ
//Mssv: 2122110359
//Ngày tạo: 12/6/2026
//Version: 1.0
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data.Entities;
using CMS.Data;
using System;
using System.Threading.Tasks;
using System.Linq;


namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApiOrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly Services.IEmailService _emailService;

        public ApiOrdersController(ApplicationDbContext context, Services.IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        /// <summary>
        /// API: Tiếp nhận đơn đặt hàng từ giỏ hàng FrontEnd gửi lên
        /// Đường dẫn: POST https://localhost:xxxx/api/Orders
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderInputDTO input)
        {
            // 1. Kiểm tra kịch bản lỗi bảo vệ: Dữ liệu trống hoặc giỏ hàng trống
            if (input == null || input.Items == null || !input.Items.Any())
            {
                return BadRequest(new { message = "Dữ liệu đơn hàng hoặc giỏ hàng không hợp lệ" });
            }

            try
            {
                // Bước A: Kiểm tra khách hàng tồn tại trong DB
                var customer = await _context.Customers.FindAsync(input.CustomerId);
                if (customer == null)
                {
                    return BadRequest(new { message = "Khách hàng không tồn tại trong hệ thống" });
                }

                // Bước B: Kiểm tra tồn kho cho tất cả sản phẩm trong đơn hàng
                foreach (var item in input.Items)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);
                    if (product == null)
                    {
                        return BadRequest(new { message = $"Sản phẩm có mã #{item.ProductId} không tồn tại" });
                    }
                    if (product.StockQuantity < item.Quantity)
                    {
                        return BadRequest(new { message = $"Sản phẩm \"{product.Name}\" chỉ còn {product.StockQuantity} trong kho, không đủ số lượng yêu cầu ({item.Quantity})" });
                    }
                }

                // Bước C: Khởi tạo cấu trúc thực thể Đơn hàng mới
                var newOrder = new Order
                {
                    OrderDate = DateTime.Now, // Tự động lấy ngày giờ thực tế máy tính lúc mua
                    CustomerId = customer.Id,
                    Status = 0,               // 0: Mặc định đơn hàng mới ở trạng thái "Chờ xử lý"
                    Notes = input.Notes ?? ""
                };

                _context.Orders.Add(newOrder);
                await _context.SaveChangesAsync(); // Ép hệ thống sinh ra mã ID Đơn hàng tự động tăng

                // Bước D: Thêm chi tiết các mặt hàng vào bảng OrderDetails và trừ tồn kho
                foreach (var item in input.Items)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);
                    if (product != null)
                    {
                        var orderDetail = new OrderDetail
                        {
                            OrderId = newOrder.Id,
                            ProductId = item.ProductId,
                            Quantity = item.Quantity,
                            UnitPrice = product.Price // Lấy giá gốc từ Database để bảo mật giá
                        };
                        _context.OrderDetails.Add(orderDetail);

                        // Trừ số lượng tồn kho sau khi đặt hàng thành công
                        product.StockQuantity -= item.Quantity;
                    }
                }
                await _context.SaveChangesAsync();

                // Gửi email thông báo đơn hàng (chạy bất đồng bộ, không chặn luồng chính)
                try
                {
                    var detailsWithProducts = await _context.OrderDetails
                        .Include(od => od.Product)
                        .Where(od => od.OrderId == newOrder.Id)
                        .ToListAsync();

                    decimal grandTotal = 0;
                    var itemsHtml = "";
                    foreach (var detail in detailsWithProducts)
                    {
                        var productName = detail.Product?.Name ?? "Sản phẩm không rõ";
                        var subtotal = detail.Quantity * detail.UnitPrice;
                        grandTotal += subtotal;

                        itemsHtml += $@"
                            <tr>
                                <td style='padding: 10px; border-bottom: 1px solid #eee;'>{productName}</td>
                                <td style='padding: 10px; border-bottom: 1px solid #eee; text-align: center;'>{detail.Quantity}</td>
                                <td style='padding: 10px; border-bottom: 1px solid #eee; text-align: right;'>{detail.UnitPrice:N0} đ</td>
                                <td style='padding: 10px; border-bottom: 1px solid #eee; text-align: right;'>{subtotal:N0} đ</td>
                            </tr>";
                    }

                    var emailSubject = $"[VuCMS] Xác nhận đơn hàng thành công #{newOrder.Id}";
                    var emailBody = $@"
                        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eef0f2; border-radius: 12px;'>
                            <h2 style='color: #ff2e2e; text-align: center;'>CẢM ƠN BẠN ĐÃ ĐẶT HÀNG!</h2>
                            <p>Xin chào <strong>{customer.FullName}</strong>,</p>
                            <p>Đơn hàng <strong>#{newOrder.Id}</strong> của bạn đã được đặt thành công vào ngày {newOrder.OrderDate:dd/MM/yyyy HH:mm}. Dưới đây là thông tin chi tiết đơn hàng:</p>
                            
                            <hr style='border: 0; border-top: 1px solid #eee;' />
                            
                            <h3>Thông tin giao hàng</h3>
                            <p><strong>Người nhận:</strong> {customer.FullName}</p>
                            <p><strong>Số điện thoại:</strong> {customer.Phone ?? "Chưa cung cấp"}</p>
                            <p><strong>Địa chỉ:</strong> {customer.Address ?? "Chưa cung cấp"}</p>
                            
                            <hr style='border: 0; border-top: 1px solid #eee;' />
                            
                            <h3>Chi tiết đơn hàng</h3>
                            <table style='width: 100%; border-collapse: collapse;'>
                                <thead>
                                    <tr style='background-color: #f9f9f9;'>
                                        <th style='padding: 10px; text-align: left;'>Sản phẩm</th>
                                        <th style='padding: 10px; text-align: center;'>SL</th>
                                        <th style='padding: 10px; text-align: right;'>Đơn giá</th>
                                        <th style='padding: 10px; text-align: right;'>Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemsHtml}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colspan='3' style='padding: 10px; text-align: right; font-weight: bold;'>Tổng thanh toán:</td>
                                        <td style='padding: 10px; text-align: right; font-weight: bold; color: #ff2e2e;'>{grandTotal:N0} đ</td>
                                    </tr>
                                </tfoot>
                            </table>
                            
                            <hr style='border: 0; border-top: 1px solid #eee;' />
                            
                            <p style='font-size: 13px; color: #666; text-align: center;'>Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua email này.</p>
                        </div>";

                    if (!string.IsNullOrEmpty(customer.Email))
                    {
                        await _emailService.SendEmailAsync(customer.Email, emailSubject, emailBody);
                    }
                }
                catch (Exception emailEx)
                {
                    Console.WriteLine($"[Lỗi gửi Email đơn hàng #{newOrder.Id}]: {emailEx.Message}");
                }

                // Bước E: Trả về mã thành công 201 Created và gửi ngược lại mã ID đơn hàng vừa tạo
                return StatusCode(201, new
                {
                    message = "Đặt hàng thành công!",
                    orderId = newOrder.Id
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi xử lý tạo đơn hàng ngầm", detail = ex.Message });
            }
        }

        // GET: api/ApiOrders/customer/{customerId}
        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetCustomerOrders(int customerId)
        {
            try
            {
                var orders = await _context.Orders
                    .Include(o => o.OrderDetails)
                        .ThenInclude(od => od.Product)
                    .Where(o => o.CustomerId == customerId)
                    .OrderByDescending(o => o.OrderDate)
                    .ToListAsync();

                var result = orders.Select(o => new
                {
                    o.Id,
                    o.OrderDate,
                    o.Status,
                    o.Notes,
                    Items = (o.OrderDetails ?? new List<OrderDetail>()).Select(od => new
                    {
                        od.Id,
                        od.ProductId,
                        ProductName = od.Product != null ? od.Product.Name : "Sản phẩm đã bị xóa",
                        ProductImageUrl = od.Product != null ? od.Product.ImageUrl : null,
                        od.Quantity,
                        od.UnitPrice
                    }).ToList()
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi lấy danh sách đơn hàng", detail = ex.Message });
            }
        }

        // PUT: api/ApiOrders/{id}/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] int status)
        {
            try
            {
                var order = await _context.Orders.FindAsync(id);
                if (order == null)
                {
                    return NotFound(new { message = "Không tìm thấy đơn hàng" });
                }

                order.Status = status;
                await _context.SaveChangesAsync();
                return Ok(new { message = "Cập nhật trạng thái đơn hàng thành công", status = order.Status });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi cập nhật trạng thái đơn hàng", detail = ex.Message });
            }
        }

        // DELETE: api/ApiOrders/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var order = await _context.Orders.FindAsync(id);
                if (order == null)
                {
                    return NotFound(new { message = "Không tìm thấy đơn hàng" });
                }

                // Xóa chi tiết đơn hàng trước để tránh lỗi khóa ngoại
                var details = _context.OrderDetails.Where(od => od.OrderId == id);
                _context.OrderDetails.RemoveRange(details);

                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Xóa đơn hàng thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi xóa đơn hàng", detail = ex.Message });
            }
        }
    }

    // LỚP DTO TRUNG GIAN ĐỂ HỨNG DỮ LIỆU TỪ FRONTEND TRUYỀN LÊN
    public class OrderInputDTO
    {
        public int CustomerId { get; set; }
        public string? Notes { get; set; }
        public List<OrderItemInputDTO> Items { get; set; } = new List<OrderItemInputDTO>();
    }

    public class OrderItemInputDTO
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}

