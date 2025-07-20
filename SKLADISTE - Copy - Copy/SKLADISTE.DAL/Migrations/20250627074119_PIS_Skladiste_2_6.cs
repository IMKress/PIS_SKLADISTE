using Microsoft.EntityFrameworkCore.Migrations;

namespace SKLADISTE.DAL.Migrations
{
    public partial class PIS_Skladiste_2_6 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PrimNaruVeze_Dokumenti_NarudzbenicaId",
                table: "PrimNaruVeze");

            migrationBuilder.AddForeignKey(
                name: "FK_PrimNaruVeze_Dokumenti_NarudzbenicaId",
                table: "PrimNaruVeze",
                column: "NarudzbenicaId",
                principalTable: "Dokumenti",
                principalColumn: "DokumentId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PrimNaruVeze_Dokumenti_NarudzbenicaId",
                table: "PrimNaruVeze");

            migrationBuilder.AddForeignKey(
                name: "FK_PrimNaruVeze_Dokumenti_NarudzbenicaId",
                table: "PrimNaruVeze",
                column: "NarudzbenicaId",
                principalTable: "Dokumenti",
                principalColumn: "DokumentId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
