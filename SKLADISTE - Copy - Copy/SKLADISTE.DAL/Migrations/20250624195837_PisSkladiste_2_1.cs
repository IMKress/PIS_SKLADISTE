using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SKLADISTE.DAL.Migrations
{
    public partial class PisSkladiste_2_1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ZaposlenikId",
                table: "StatusiDokumenata",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "aktivan",
                table: "StatusiDokumenata",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "DobavljacId",
                table: "Dokumenti",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DobavljacId1",
                table: "Dokumenti",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Napomena",
                table: "Dokumenti",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PrimateljId",
                table: "Dokumenti",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ZaposlenikId",
                table: "ArtikliDokumenata",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Dobavljaci",
                columns: table => new
                {
                    DobavljacId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DobavljacNaziv = table.Column<string>(nullable: true),
                    AdresaDobavljaca = table.Column<string>(nullable: true),
                    brojTelefona = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dobavljaci", x => x.DobavljacId);
                });

            migrationBuilder.CreateTable(
                name: "NaciniPlacanja",
                columns: table => new
                {
                    NP_Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NP_Naziv = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NaciniPlacanja", x => x.NP_Id);
                });

            migrationBuilder.CreateTable(
                name: "NarudzbenicaDetalji",
                columns: table => new
                {
                    DokumentId = table.Column<int>(nullable: false),
                    NP_Id = table.Column<int>(nullable: false),
                    MjestoIsporuke = table.Column<string>(nullable: true),
                    RokIsporuke = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NarudzbenicaDetalji", x => x.DokumentId);
                    table.ForeignKey(
                        name: "FK_NarudzbenicaDetalji_Dokumenti_DokumentId",
                        column: x => x.DokumentId,
                        principalTable: "Dokumenti",
                        principalColumn: "DokumentId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PrimNaruVeze",
                columns: table => new
                {
                    PrimkaId = table.Column<int>(nullable: false),
                    NarudzbenicaId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrimNaruVeze", x => new { x.PrimkaId, x.NarudzbenicaId });
                });

            migrationBuilder.CreateIndex(
                name: "IX_Dokumenti_DobavljacId",
                table: "Dokumenti",
                column: "DobavljacId");

            migrationBuilder.CreateIndex(
                name: "IX_Dokumenti_DobavljacId1",
                table: "Dokumenti",
                column: "DobavljacId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Dokumenti_Dobavljaci_DobavljacId",
                table: "Dokumenti",
                column: "DobavljacId",
                principalTable: "Dobavljaci",
                principalColumn: "DobavljacId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Dokumenti_Dobavljaci_DobavljacId1",
                table: "Dokumenti",
                column: "DobavljacId1",
                principalTable: "Dobavljaci",
                principalColumn: "DobavljacId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Dokumenti_Dobavljaci_DobavljacId",
                table: "Dokumenti");

            migrationBuilder.DropForeignKey(
                name: "FK_Dokumenti_Dobavljaci_DobavljacId1",
                table: "Dokumenti");

            migrationBuilder.DropTable(
                name: "Dobavljaci");

            migrationBuilder.DropTable(
                name: "NaciniPlacanja");

            migrationBuilder.DropTable(
                name: "NarudzbenicaDetalji");

            migrationBuilder.DropTable(
                name: "PrimNaruVeze");

            migrationBuilder.DropIndex(
                name: "IX_Dokumenti_DobavljacId",
                table: "Dokumenti");

            migrationBuilder.DropIndex(
                name: "IX_Dokumenti_DobavljacId1",
                table: "Dokumenti");

            migrationBuilder.DropColumn(
                name: "ZaposlenikId",
                table: "StatusiDokumenata");

            migrationBuilder.DropColumn(
                name: "aktivan",
                table: "StatusiDokumenata");

            migrationBuilder.DropColumn(
                name: "DobavljacId",
                table: "Dokumenti");

            migrationBuilder.DropColumn(
                name: "DobavljacId1",
                table: "Dokumenti");

            migrationBuilder.DropColumn(
                name: "Napomena",
                table: "Dokumenti");

            migrationBuilder.DropColumn(
                name: "PrimateljId",
                table: "Dokumenti");

            migrationBuilder.DropColumn(
                name: "ZaposlenikId",
                table: "ArtikliDokumenata");
        }
    }
}
