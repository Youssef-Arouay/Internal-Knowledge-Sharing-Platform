using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class tableFile3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SavedPost_Posts_PostId",
                table: "SavedPost");

            migrationBuilder.DropForeignKey(
                name: "FK_SavedPost_Users_UserId",
                table: "SavedPost");

            /*migrationBuilder.DropTable(
                name: "FileEntities");*/

            migrationBuilder.DropPrimaryKey(
                name: "PK_SavedPost",
                table: "SavedPost");

            migrationBuilder.RenameTable(
                name: "SavedPost",
                newName: "SavedPosts");

            migrationBuilder.RenameIndex(
                name: "IX_SavedPost_UserId",
                table: "SavedPosts",
                newName: "IX_SavedPosts_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SavedPosts",
                table: "SavedPosts",
                columns: new[] { "PostId", "UserId" });

            migrationBuilder.AddForeignKey(
                name: "FK_SavedPosts_Posts_PostId",
                table: "SavedPosts",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "PostId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SavedPosts_Users_UserId",
                table: "SavedPosts",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SavedPosts_Posts_PostId",
                table: "SavedPosts");

            migrationBuilder.DropForeignKey(
                name: "FK_SavedPosts_Users_UserId",
                table: "SavedPosts");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SavedPosts",
                table: "SavedPosts");

            migrationBuilder.RenameTable(
                name: "SavedPosts",
                newName: "SavedPost");

            migrationBuilder.RenameIndex(
                name: "IX_SavedPosts_UserId",
                table: "SavedPost",
                newName: "IX_SavedPost_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SavedPost",
                table: "SavedPost",
                columns: new[] { "PostId", "UserId" });

            migrationBuilder.CreateTable(
                name: "FileEntities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FileName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Theme = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Version = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FileEntities", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_SavedPost_Posts_PostId",
                table: "SavedPost",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "PostId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SavedPost_Users_UserId",
                table: "SavedPost",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
