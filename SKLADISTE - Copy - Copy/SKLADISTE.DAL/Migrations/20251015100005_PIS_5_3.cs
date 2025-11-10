using Microsoft.EntityFrameworkCore.Migrations;

namespace SKLADISTE.DAL.Migrations
{
    public partial class PIS_5_3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ArhiveStanja",
                table: "ArhiveStanja");

            migrationBuilder.DropColumn(
                name: "ZapisKnjigeStanjaId",
                table: "ArhiveStanja");

            migrationBuilder.AddColumn<int>(
                name: "ZapisArhiveStanjaId",
                table: "ArhiveStanja",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ArhiveStanja",
                table: "ArhiveStanja",
                column: "ZapisArhiveStanjaId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ArhiveStanja",
                table: "ArhiveStanja");

            migrationBuilder.DropColumn(
                name: "ZapisArhiveStanjaId",
                table: "ArhiveStanja");

            migrationBuilder.AddColumn<int>(
                name: "ZapisKnjigeStanjaId",
                table: "ArhiveStanja",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ArhiveStanja",
                table: "ArhiveStanja",
                column: "ZapisKnjigeStanjaId");
        }
    }
}
