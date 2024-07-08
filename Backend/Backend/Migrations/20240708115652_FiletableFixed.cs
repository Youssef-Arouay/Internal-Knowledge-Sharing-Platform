using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class FiletableFixed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CreationDate",
                table: "FileEntities",
                newName: "UploadDate");

            migrationBuilder.AddColumn<int>(
                name: "downlaods",
                table: "FileEntities",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "rates",
                table: "FileEntities",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "downlaods",
                table: "FileEntities");

            migrationBuilder.DropColumn(
                name: "rates",
                table: "FileEntities");

            migrationBuilder.RenameColumn(
                name: "UploadDate",
                table: "FileEntities",
                newName: "CreationDate");
        }
    }
}
