
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
    //Thực thể đơn hàng
    public class Order
    {
        [Key]
        public int Id { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.Now;// Ngày đặt hàng
        public int CustomerId { get; set; } // Mã khách hàng (khóa ngoại)
        public int Status { get; set; } // Trạng thái đơn hàng (0: Chờ duyệt, 1: Đang giao , 2: Đã xong)
        public string? Notes { get; set; }
        [ForeignKey("CustomerId")]
        public virtual Customer? Customer { get; set; } // Tham chiếu đến khách hàng của đơn hàng
        public virtual ICollection<OrderDetail>? OrderDetails { get; set; } // Danh sách chi tiết đơn hàng

    }
}
