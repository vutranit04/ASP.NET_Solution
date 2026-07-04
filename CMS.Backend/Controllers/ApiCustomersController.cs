using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApiCustomersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly Services.IEmailService _emailService;

        public ApiCustomersController(ApplicationDbContext context, Services.IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // POST: api/ApiCustomers/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterInputDTO input)
        {
            if (input == null || string.IsNullOrEmpty(input.Email) || string.IsNullOrEmpty(input.Password))
            {
                return BadRequest(new { message = "Thông tin đăng ký không hợp lệ" });
            }

            try
            {
                // Kiểm tra xem email đã được sử dụng chưa
                var existingCustomer = await _context.Customers.AnyAsync(c => c.Email == input.Email);
                if (existingCustomer)
                {
                    return BadRequest(new { message = "Email này đã được đăng ký tài khoản" });
                }

                var customer = new Customer
                {
                    FullName = input.FullName,
                    Email = input.Email,
                    Phone = input.Phone,
                    Address = input.Address,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(input.Password) // Mã hóa mật khẩu một chiều bằng BCrypt trước khi lưu vào CSDL
                };

                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();

                return StatusCode(201, new { message = "Đăng ký tài khoản thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi đăng ký", detail = ex.Message });
            }
        }

        // POST: api/ApiCustomers/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginInputDTO input)
        {
            if (input == null || string.IsNullOrEmpty(input.Email) || string.IsNullOrEmpty(input.Password))
            {
                return Ok(new { success = false, message = "Thông tin đăng nhập không hợp lệ" });
            }

            try
            {
                // Tìm khách hàng theo Email trước, sau đó kiểm tra mật khẩu bằng BCrypt
                var customer = await _context.Customers
                    .FirstOrDefaultAsync(c => c.Email == input.Email);

                if (customer == null || !BCrypt.Net.BCrypt.Verify(input.Password, customer.PasswordHash))
                {
                    return Ok(new { success = false, message = "Email hoặc mật khẩu không chính xác" });
                }

                return Ok(new
                {
                    success = true,
                    user = new
                    {
                        id = customer.Id,
                        fullName = customer.FullName,
                        email = customer.Email,
                        phone = customer.Phone,
                        address = customer.Address
                    }
                });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = "Lỗi hệ thống khi đăng nhập", detail = ex.Message });
            }
        }

        // PUT: api/ApiCustomers/update
        [HttpPut("update")]
        public async Task<IActionResult> Update([FromBody] CustomerUpdateDTO input)
        {
            if (input == null || input.Id <= 0)
            {
                return BadRequest(new { message = "Thông tin cập nhật không hợp lệ" });
            }

            try
            {
                var customer = await _context.Customers.FindAsync(input.Id);
                if (customer == null)
                {
                    return NotFound(new { message = "Không tìm thấy khách hàng trong hệ thống" });
                }

                // Cập nhật thông tin cơ bản
                customer.FullName = input.FullName;
                customer.Phone = input.Phone;
                customer.Address = input.Address;

                // Chỉ cập nhật mật khẩu nếu được truyền lên
                if (!string.IsNullOrEmpty(input.Password))
                {
                    customer.PasswordHash = BCrypt.Net.BCrypt.HashPassword(input.Password); // Mã hóa mật khẩu mới
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    id = customer.Id,
                    fullName = customer.FullName,
                    email = customer.Email,
                    phone = customer.Phone,
                    address = customer.Address
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi cập nhật hồ sơ", detail = ex.Message });
            }
        }

        // GET: api/ApiCustomers/check-email
        [HttpGet("check-email")]
        public async Task<IActionResult> CheckEmail([FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new { message = "Email không được để trống" });
            }

            var exists = await _context.Customers.AnyAsync(c => c.Email == email);
            return Ok(new { exists = exists });
        }

        // POST: api/ApiCustomers/forgot-password
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordInputDTO input)
        {
            if (input == null || string.IsNullOrEmpty(input.Email))
            {
                return BadRequest(new { message = "Email không được để trống" });
            }

            try
            {
                var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == input.Email);
                if (customer == null)
                {
                    return NotFound(new { message = "Email này không tồn tại trong hệ thống" });
                }

                // 1. Tạo mật khẩu mới ngẫu nhiên (8 ký tự)
                var random = new Random();
                const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                var newPassword = new string(Enumerable.Repeat(chars, 8)
                    .Select(s => s[random.Next(s.Length)]).ToArray());

                // 2. Cập nhật mật khẩu mới vào CSDL (bằng hash BCrypt)
                customer.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
                await _context.SaveChangesAsync();

                // 3. Gửi email
                var emailSubject = "[VuCMS] Khôi phục mật khẩu tài khoản thành công";
                var emailBody = $@"
                    <div style='font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eef0f2; border-radius: 12px;'>
                        <h2 style='color: #ff2e2e; text-align: center;'>KHÔI PHỤC MẬT KHẨU</h2>
                        <p>Xin chào <strong>{customer.FullName}</strong>,</p>
                        <p>Bạn đã gửi yêu cầu khôi phục mật khẩu cho tài khoản liên kết với email này.</p>
                        <p>Chúng tôi đã đặt lại mật khẩu của bạn thành mật khẩu tạm thời dưới đây:</p>
                        
                        <div style='background-color: #f9f9f9; padding: 15px; text-align: center; border-radius: 8px; font-size: 18px; font-weight: bold; color: #111; border: 1px dashed #ddd; margin: 20px 0;'>
                            {newPassword}
                        </div>
                        
                        <p style='color: #ff2e2e; font-weight: bold;'>Lưu ý quan trọng:</p>
                        <p>Vui lòng sử dụng mật khẩu này đăng nhập và đổi lại mật khẩu mới tại trang <strong>Thông tin cá nhân</strong> để bảo mật tài khoản.</p>
                        
                        <hr style='border: 0; border-top: 1px solid #eee;' />
                        <p style='font-size: 12px; color: #666; text-align: center;'>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email hoặc liên hệ với chúng tôi.</p>
                    </div>";

                await _emailService.SendEmailAsync(customer.Email, emailSubject, emailBody);

                return Ok(new { message = "Mật khẩu mới đã được gửi về email của bạn." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi khôi phục mật khẩu", detail = ex.Message });
            }
        }
    }

    public class ForgotPasswordInputDTO
    {
        public string Email { get; set; } = string.Empty;
    }

    public class RegisterInputDTO
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string Password { get; set; } = string.Empty;
    }

    public class LoginInputDTO
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class CustomerUpdateDTO
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? Password { get; set; }
    }
}
