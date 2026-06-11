
//Họ và tên: Trần Minh Vũ
//Mssv: 2122110359
//Ngày tạo: 23/5/2026 10:06
//Version: 1.0
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CMS.Data.Entities;
namespace CMS.Data
{

    public class ApplicationDbContext : DbContext
    {
        // Constructor nhận DbContextOptions để cấu hình kết nối cơ sở dữ liệu
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        //Định nghĩa các DbSet tương ứng với các bảng cho các thực thể
        public DbSet<Category> Categories { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<CategoryProduct> CategoriesProducts { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }






    }
}
