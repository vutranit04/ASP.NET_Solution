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
    //Thực thể khách hàng
    public class Customer
    {
        [Key]
        public int Id { get; set; } // Mã khách hàng
        [Required]
        public string FullName { get; set; } // Tên khách hàng
        [Required]
        [EmailAddress(ErrorMessage = "Địa chỉ email không hợp lệ")]
        public string Email { get; set; } // Email của khách hàng
        public string? Phone { get; set; } // Số điện thoại của khách hàng
        public string? Address { get; set; } // Địa chỉ của khách hàng
        public string Password { get; set; } //Lưu mật khẩu thô theo yêu cầu tối giản
        public virtual ICollection<Order>? Orders { get; set; } // Danh sách đơn hàng của khách hàng
    }
}
