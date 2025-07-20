using Microsoft.EntityFrameworkCore.Migrations;

namespace SKLADISTE.DAL.Migrations
{
    public partial class PIS_Skladiste_3_0 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PrimateljId",
                table: "Dokumenti");

            migrationBuilder.AddColumn<string>(
                name: "MjestoTroska",
                table: "Dokumenti",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MjestoTroska",
                table: "Dokumenti");

            migrationBuilder.AddColumn<int>(
                name: "PrimateljId",
                table: "Dokumenti",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
