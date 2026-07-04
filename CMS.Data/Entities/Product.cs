
//Họ và tên: Trần Minh Vũ
//Mssv: 2122110359
//Ngày tạo: 16/5/2026
//Version: 1.0
using System.ComponentModel.DataAnnotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS.Data.Entities
{
    public class Product
    {   
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "Tên sản phẩm không được để trống")]
        public string Name { get; set; } // Tên sản phẩm
        public string? Description { get; set; } // Mô tả về sản phẩm


        [Range(0,double.MaxValue, ErrorMessage = "Giá sản phẩm phải lớn hơn hoặc bằng 0")]
        [Column(TypeName = "decimal(18, 2)")]// Định dạng cho cột giá sản phẩm
        public decimal Price { get; set; } // Giá sản phẩm
        public string?  ImageUrl { get; set; } // Hình ảnh đại diện của sản phẩm
        public int StockQuantity { get; set; } // Số lượng tồn kho của sản phẩm
        //khóa ngoại liên kết đến CategoryProduct
        public int CategoryProductId { get; set; }
        [ForeignKey("CategoryProductId")]
        public virtual CategoryProduct? CategoryProduct { get; set; } // Tham chiếu đến danh mục sản phẩm của sản phẩm

    }
}
