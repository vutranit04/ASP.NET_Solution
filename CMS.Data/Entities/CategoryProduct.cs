

//Họ và tên: Trần Minh Vũ
//Mssv: 2122110359
//Ngày tạo: 16/5/2026
//Version: 1.0
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Data.Entities
{
    //Thực thể danh mục sản phẩm
    public class CategoryProduct
    {
        [Key]
        public int Id { get; set; } // Mã danh mục sản phẩm
        [Required(ErrorMessage ="Tên danh mục sản phẩm không được để trống")]
        [StringLength(100)]
        public string Name { get; set; } // Tên danh mục sản phẩm
        public string? Description { get; set; } // Mô tả về danh mục sản phẩm



        //Quan hệ: một danh mục sản phẩm có nhiều sản phẩm
        public virtual ICollection<Product>? Products { get; set; } // Danh sách sản phẩm thuộc danh mục này
    }
}
