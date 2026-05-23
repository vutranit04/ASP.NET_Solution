
//Họ và tên: Trần Minh Vũ
//Mssv: 2122110359
//Ngày tạo: 16/5/2026
//Version: 1.0

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//Thực thể danh mục (Category)
namespace CMS.Data.Entities
{
    public class Category
    {
        public int Id { get; set; }// Mã danh mục
        public string Name { get; set; } // Tên danh mục
        public string Description { get; set; }// Mô tả về danh mục
        //quan hệ một danh mục có nhiều bài viết
        public virtual ICollection<Post> Posts { get; set; } // Danh sách bài viết thuộc danh mục này
    }
}
