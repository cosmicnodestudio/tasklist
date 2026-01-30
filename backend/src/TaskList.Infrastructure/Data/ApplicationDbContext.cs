using Microsoft.EntityFrameworkCore;
using TaskList.Core.Entities;

namespace TaskList.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<TaskItem> Tasks { get; set; }
    public DbSet<Category> Categories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User Configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Username)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.PasswordHash)
                .IsRequired()
                .HasMaxLength(255);

            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.Username).IsUnique();

            entity.HasMany(e => e.Tasks)
                .WithOne(e => e.User)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.Categories)
                .WithOne(e => e.User)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // TaskItem Configuration
        modelBuilder.Entity<TaskItem>(entity =>
        {
            entity.ToTable("Tasks");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Title)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.Description)
                .HasColumnType("text");

            entity.Property(e => e.Status)
                .HasConversion<string>()
                .HasMaxLength(20);

            entity.Property(e => e.Priority)
                .HasConversion<string>()
                .HasMaxLength(20);

            entity.HasIndex(e => new { e.UserId, e.Status });
            entity.HasIndex(e => e.DueDate);
            entity.HasIndex(e => e.CategoryId);

            entity.HasOne(e => e.User)
                .WithMany(e => e.Tasks)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Category)
                .WithMany(e => e.Tasks)
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Category Configuration
        modelBuilder.Entity<Category>(entity =>
        {
            entity.ToTable("Categories");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(e => e.Color)
                .HasMaxLength(7)
                .HasDefaultValue("#3B82F6");

            entity.HasIndex(e => e.UserId);

            entity.HasOne(e => e.User)
                .WithMany(e => e.Categories)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
