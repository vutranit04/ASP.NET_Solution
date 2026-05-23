
//Họ và tên: Trần Minh Vũ
//Mssv: 2122110359
//Ngày tạo: 16/5/2026
//Version: 1.0

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Data.Entities
{
    public class User
    {
        public int Id { get; set; } // Mã người dùng
        public string Username { get; set; } // Tên đăng nhập
        public string PasswordHash{  get; set; } // Mật khẩu (lưu trữ dưới dạng hash)
        public string FullName { get; set; } // Tên đầy đủ
        public string Role { get; set; } // Vai trò của người dùng (Admin, Editor)  
    }
}
