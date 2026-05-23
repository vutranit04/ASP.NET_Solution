
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
    public class Post
    {
        public int Id { get; set; } // Mã bài viết  
        public string Title { get; set; } // Tiêu đề bài viết
        public string Content { get; set; } // Nội dung bài viết
        public string ImageUrl { get; set; } // Hình ảnh đại diện của bài viết

        public DateTime CreatedDate { get; set; } = DateTime.Now; // Ngày tạo bài viết
        //khóa ngoại liên kết đến Category
        public int CategoryId { get; set; } 
        public virtual Category Category { get; set; } // Tham chiếu đến danh mục của bài viết
    }
}
