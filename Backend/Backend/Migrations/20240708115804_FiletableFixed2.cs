using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class FiletableFixed2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "rates",
                table: "FileEntities",
                newName: "Rates");

            migrationBuilder.RenameColumn(
                name: "downlaods",
                table: "FileEntities",
                newName: "Downloads");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Rates",
                table: "FileEntities",
                newName: "rates");

            migrationBuilder.RenameColumn(
                name: "Downloads",
                table: "FileEntities",
                newName: "downlaods");
        }
    }
}
