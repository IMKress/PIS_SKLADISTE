using Microsoft.EntityFrameworkCore.Migrations;

namespace SKLADISTE.DAL.Migrations
{
    public partial class popravak_veza_baze : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_SkladisteLokacija_skladiste_id",
                table: "SkladisteLokacija",
                column: "skladiste_id");

            migrationBuilder.CreateIndex(
                name: "IX_ArhiveDokumenti_ArhivaId",
                table: "ArhiveDokumenti",
                column: "ArhivaId");

            migrationBuilder.CreateIndex(
                name: "IX_ArhiveDokumenti_DokumentId",
                table: "ArhiveDokumenti",
                column: "DokumentId");

            migrationBuilder.AddForeignKey(
                name: "FK_ArhiveDokumenti_Arhive_ArhivaId",
                table: "ArhiveDokumenti",
                column: "ArhivaId",
                principalTable: "Arhive",
                principalColumn: "ArhivaId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ArhiveDokumenti_Dokumenti_DokumentId",
                table: "ArhiveDokumenti",
                column: "DokumentId",
                principalTable: "Dokumenti",
                principalColumn: "DokumentId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SkladisteLokacija_SkladistePodatcis_skladiste_id",
                table: "SkladisteLokacija",
                column: "skladiste_id",
                principalTable: "SkladistePodatcis",
                principalColumn: "SkladisteId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ArhiveDokumenti_Arhive_ArhivaId",
                table: "ArhiveDokumenti");

            migrationBuilder.DropForeignKey(
                name: "FK_ArhiveDokumenti_Dokumenti_DokumentId",
                table: "ArhiveDokumenti");

            migrationBuilder.DropForeignKey(
                name: "FK_SkladisteLokacija_SkladistePodatcis_skladiste_id",
                table: "SkladisteLokacija");

            migrationBuilder.DropIndex(
                name: "IX_SkladisteLokacija_skladiste_id",
                table: "SkladisteLokacija");

            migrationBuilder.DropIndex(
                name: "IX_ArhiveDokumenti_ArhivaId",
                table: "ArhiveDokumenti");

            migrationBuilder.DropIndex(
                name: "IX_ArhiveDokumenti_DokumentId",
                table: "ArhiveDokumenti");
        }
    }
}
