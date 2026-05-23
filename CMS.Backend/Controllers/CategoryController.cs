
//Họ và tên: Trần Minh Vũ
//Mssv: 2122110359
//Ngày tạo: 18/5/2026 22:16
//Version: 1.0

using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities;
namespace CMS.Backend.Controllers

{

    //Controller để quản lý các thể loại (categories) trong hệ thống
    public class CategoryController : Controller
    {
        public IActionResult Index()
        {
            var list= new List<Category>
            //Tạo một danh sách mẫu các thể loại để hiển thị
            {
                new Category { Id = 1, Name = "Technology" , Description = "All about technology" },
                new Category { Id = 2, Name = "Health", Description = "Health and wellness topics" },
                new Category { Id = 3, Name = "Travel", Description = "Travel guides and tips" }
            };
            return View(list);//Gửi danh sách này sang giao diện để hiển thị
        }
    }
}
