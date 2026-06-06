//Họ và tên: Trần Minh Vũ
//Mssv: 2122110359
//Ngày tạo: 18/5/2026
//Version: 1.0
using CMS.Data;
using CMS.Data.Entities; // Phải có dòng này để dùng lớp User
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class UserController : Controller

    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }
        // Hàm Index: Hiển thị danh sách thành viên quản trị
        public IActionResult Index()
        {
            // 1. Tạo danh sách Người dùng giả (Mock Data)
            var users = _context.Users.ToList(); // Lấy tất cả người dùng từ Database   


            // 2. Trả về View kèm theo danh sách người dùng
            return View(users);
        }
    }
}
