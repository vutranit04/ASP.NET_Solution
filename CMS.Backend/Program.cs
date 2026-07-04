using CMS.Data;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
//Sử dụng Entity Framework Core để quản lý cơ sở dữ liệu
//Nhận dữ liệu kết nối từ CMS.Data (Dữ liệu thật), được cấu hình trong appsetting.json

var builder = WebApplication.CreateBuilder(args);

// Cấu hình DbContext với chuỗi kết nối từ appsettings.json
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 1. KHU VỰC ĐĂNG KÝ DỊCH VỤ (SERVICES CONTAINER)
builder.Services.AddControllersWithViews(); //Lệnh này vừa nhận diện các API mới, vừa giữ quyền biên dịch các View (.cshtml) của Web MVC cũ

// Đăng ký dịch vụ lõi giúp hệ thống tự động bóc tách thông tin Endpoint phục vụ Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); // -- Kích hoạt bộ sinh tài liệu API Swagger

// Đăng ký dịch vụ Gửi Email
builder.Services.Configure<CMS.Backend.Models.EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.AddTransient<CMS.Backend.Services.IEmailService, CMS.Backend.Services.EmailService>();
// . Khai báo dịch vụ xác thực Cookie
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login"; // Đường dẫn nếu chưa đăng nhập
        options.AccessDeniedPath = "/Account/AccessDenied"; // Đường dẫn nếu vào trang không được phép
    });

// CẤU HÌNH CHÍNH SÁCH CORS: Cho phép ReactJS gọi API mà không bị chặn bởi trình duyệt
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Cho phép ReactJS ở port 3000 gọi tới
              .AllowAnyHeader()                     // Cho phép mọi loại Header (Content-Type, Authorization...)
              .AllowAnyMethod()                     // Cho phép mọi phương thức HTTP (GET, POST, PUT, DELETE)
              .AllowCredentials();                  // Hỗ trợ truyền Cookie/Session nếu cần sau này
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage(); // Hiển thị chi tiết lỗi khi đang phát triển
}
else
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
// ==============================================================
//  2. KHU VỰC CẤU HÌNH MIDDLEWARE (REQUEST PIPELINE)
// ==============================================================
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "VuCMS Web API v1");
    c.RoutePrefix = "swagger"; // -- Đường dẫn truy cập mặc định sẽ là /swagger
});

app.UseHttpsRedirection();

app.UseRouting();

// Phục vụ file tĩnh (ảnh, CSS, JS...) từ thư mục wwwroot
app.UseStaticFiles();

// [VỊ TRÍ ĐẶT CORS]: Phải nằm ngay giữa UseRouting và UseAuthentication/UseAuthorization
app.UseCors("AllowReactApp");

app.UseAuthentication(); // BƯỚC A: Xác nhận "Anh là ai?" (Kiểm tra thẻ bài)
app.UseAuthorization();  // BƯỚC B: Xác nhận "Anh được làm gì?" (Kiểm tra quyền)

// ===============================================================
// 3. KHU VỰC ĐỊNH TUYẾN PHÂN LUỒNG (ROUTING MAP)
//  đặt sau dòng UseAuthorization();
// ===============================================================

// Phân luồng A: 
// Ánh xạ các Endpoint API tuân thủ theo cấu trúc [Route("api/[controller]")]
app.MapControllers();
// Phân luồng B: Giữ lại bản đồ đường đi mặc định cho trang giao diện Web MVC cũ
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();

