using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Newtonsoft.Json;

namespace Backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<FileEntity> FileEntities { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<SavedPost> SavedPosts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasMany(u => u.Posts)
                .WithOne(p => p.User)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);  // Or Cascade if needed

            // Configure the relationship between Post and Comment
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Post)
                .WithMany(p => p.Comments)
                .HasForeignKey(c => c.PostId)
                .OnDelete(DeleteBehavior.Restrict);  // Prevent cascading delete

            // Configure the relationship between Post and Like
            modelBuilder.Entity<Like>()
                .HasOne(l => l.Post)
                .WithMany(p => p.Likes)
                .HasForeignKey(l => l.PostId)
                .OnDelete(DeleteBehavior.Restrict);  // Prevent cascading delete

            // Configure the relationship between Post and SavedPost (PostSave)
            modelBuilder.Entity<SavedPost>()
                .HasKey(ps => new { ps.PostId, ps.UserId });

            modelBuilder.Entity<SavedPost>()
                .HasOne(ps => ps.Post)
                .WithMany(p => p.SavedByUsers)
                .HasForeignKey(ps => ps.PostId)
                .OnDelete(DeleteBehavior.Cascade);  // Cascade delete from Post to SavedPost

            modelBuilder.Entity<SavedPost>()
                .HasOne(ps => ps.User)
                .WithMany(u => u.SavedPosts)
                .HasForeignKey(ps => ps.UserId)
                .OnDelete(DeleteBehavior.Cascade);  // Cascade delete from User to SavedPost

            /*modelBuilder.Entity<FileEntity>()
                 .HasOne(f => f.Post)
                 .WithOne(p => p.File)
                 .HasForeignKey<FileEntity>(f => f.PostId)
                 .OnDelete(DeleteBehavior.Cascade);*/

            /*modelBuilder.Entity<Post>()
                .Property(p => p.TagsAsString)
                .HasColumnName("Tags");*/


        }


    }
}
