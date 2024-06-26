﻿using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
        public class ApplicationDbContext : DbContext
        {
            public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
            {
            }

            public DbSet<User> Users { get; set; }
        }
}
