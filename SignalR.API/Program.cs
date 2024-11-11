using SignalR.API.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();

builder.Services.AddCors(action =>
{
    action.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("https://localhost:7250") // Frontend URL
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();  // Eðer front-end'de cookie veya oturum kullanýyorsanýz
    });
});





var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

app.MapHub<MyHub>("/myhub");


app.UseAuthorization();

app.MapControllers();

app.Run();
