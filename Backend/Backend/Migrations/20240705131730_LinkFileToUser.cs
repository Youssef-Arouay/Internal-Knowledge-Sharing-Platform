using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class LinkFileToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "FileEntities",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_FileEntities_UserId",
                table: "FileEntities",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_FileEntities_Users_UserId",
                table: "FileEntities",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FileEntities_Users_UserId",
                table: "FileEntities");

            migrationBuilder.DropIndex(
                name: "IX_FileEntities_UserId",
                table: "FileEntities");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "FileEntities");
        }
    }
}
