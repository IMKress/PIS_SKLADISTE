using Microsoft.EntityFrameworkCore.Migrations;

namespace SKLADISTE.DAL.Migrations
{
    public partial class PisSkladiste_2_5_2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Dokumenti_Dobavljaci_DobavljacId",
                table: "Dokumenti");

            migrationBuilder.AddForeignKey(
                name: "FK_Dokumenti_Dobavljaci_DobavljacId",
                table: "Dokumenti",
                column: "DobavljacId",
                principalTable: "Dobavljaci",
                principalColumn: "DobavljacId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Dokumenti_Dobavljaci_DobavljacId",
                table: "Dokumenti");

            migrationBuilder.AddForeignKey(
                name: "FK_Dokumenti_Dobavljaci_DobavljacId",
                table: "Dokumenti",
                column: "DobavljacId",
                principalTable: "Dobavljaci",
                principalColumn: "DobavljacId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
