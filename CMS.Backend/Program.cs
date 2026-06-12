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
// . Khai báo dịch vụ xác thực Cookie
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login"; // Đường dẫn nếu chưa đăng nhập
        options.AccessDeniedPath = "/Account/AccessDenied"; // Đường dẫn nếu vào trang không được phép
    });

//CẤU HÌNH CHÍNH SÁCH CORS: Cho phép các ứng dụng khác (như ReactJS) có thể gọi API của chúng ta mà không bị chặn bởi trình duyệt
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", policy => {
        // Cho phép mọi nguồn cấp (Origin), mọi phương thức gọi (GET, POST...), và mọi thông tin đi kèm (Header)
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
// ---- CẤU HÌNH CORS (THÊM VÀO TRƯỚC builder.Build()) ----
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
if (!app.Environment.IsDevelopment())
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
app.UseStaticFiles();

app.UseRouting();
// [VỊ TRÍ ĐẶT CORS]: Phải nằm ngay giữa UseRouting và app.UseAuthentication(); UseAuthorization();
app.UseStaticFiles();

// Kích hoạt CORS đúng vị trí này
app.UseCors("AllowReactApp");
app.UseCors("AllowAll");
// ===================================
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
