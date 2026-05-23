//Họ và tên: Trần Minh Vũ
//Mssv: 2122110359
//Ngày tạo: 16/5/2026
//Version: 1.0
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Data.Entities
{

    //Thực thể chi tiết đơn hàng
    public class OrderDetail
    {
        [Key]
        public int Id { get; set; }
        public int OrderId { get; set; } // Mã đơn hàng (khóa ngoại)
        public int ProductId { get; set; } // Mã sản phẩm (khóa ngoại)

        public int Quantity { get; set; }

        [Column(TypeName = "decimal(18, 2)")]
        public decimal UnitPrice { get; set; } // Giá đơn vị tại thời điểm đặt hàng
        [ForeignKey("OrderId")]
        public virtual Order? Order { get; set; } // Tham chiếu đến đơn hàng của chi tiết đơn hàng
        [ForeignKey("ProductId")]
        public virtual Product? Product { get; set; } // Tham chiếu đến sản phẩm của chi tiết đơn hàng


    }
}
