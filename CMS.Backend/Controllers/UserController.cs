//Họ và tên: Trần Minh Vũ
//Mssv: 2122110359
//Ngày tạo: 18/5/2026
//Version: 1.0
using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities; // Phải có dòng này để dùng lớp User

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        // Hàm Index: Hiển thị danh sách thành viên quản trị
        public IActionResult Index()
        {
            // 1. Tạo danh sách Người dùng giả (Mock Data)
            var users = new List<User>
            {
                new User
                {
                    Id = 1,
                    Username = "admin_mvu",
                    FullName = "Trần Minh Vũ",
                    Role = "Administrator"
                },
                new User
                {
                    Id = 2,
                    Username = "editor_tai",
                    FullName = "Huỳnh Hữu Tài",
                    Role = "Editor"
                },
                new User
                {
                    Id = 3,
                    Username = "author_vien",
                    FullName = "Võ Trúc Viên",
                    Role = "Author"
                }
            };

            // 2. Trả về View kèm theo danh sách người dùng
            return View(users);
        }
    }
}
