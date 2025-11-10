using Microsoft.EntityFrameworkCore.Migrations;

namespace SKLADISTE.DAL.Migrations
{
    public partial class PIS_6_5_fix_id : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LokacijeArtikala_ArtikliDokumenata_ART_DOK_ID",
                table: "LokacijeArtikala");

            migrationBuilder.AddForeignKey(
                name: "FK_LokacijeArtikala_ArtikliDokumenata_ART_DOK_ID",
                table: "LokacijeArtikala",
                column: "ART_DOK_ID",
                principalTable: "ArtikliDokumenata",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LokacijeArtikala_ArtikliDokumenata_ART_DOK_ID",
                table: "LokacijeArtikala");

            migrationBuilder.AddForeignKey(
                name: "FK_LokacijeArtikala_ArtikliDokumenata_ART_DOK_ID",
                table: "LokacijeArtikala",
                column: "ART_DOK_ID",
                principalTable: "ArtikliDokumenata",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
