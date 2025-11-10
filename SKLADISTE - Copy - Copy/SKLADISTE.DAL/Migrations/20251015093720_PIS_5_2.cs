using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SKLADISTE.DAL.Migrations
{
    public partial class PIS_5_2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Arhive",
                columns: table => new
                {
                    ArhivaId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DatumArhive = table.Column<DateTime>(nullable: false),
                    ArhivaOznaka = table.Column<string>(nullable: true),
                    ArhivaNaziv = table.Column<string>(nullable: true),
                    Napomena = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Arhive", x => x.ArhivaId);
                });

            migrationBuilder.CreateTable(
                name: "ArhiveStanja",
                columns: table => new
                {
                    ZapisKnjigeStanjaId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ArhivaId = table.Column<int>(nullable: false),
                    ArtiklId = table.Column<int>(nullable: false),
                    ArtiklKolicina = table.Column<int>(nullable: false),
                    ArhivaId1 = table.Column<int>(nullable: true),
                    ArtiklId1 = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArhiveStanja", x => x.ZapisKnjigeStanjaId);
                    table.ForeignKey(
                        name: "FK_ArhiveStanja_Arhive_ArhivaId",
                        column: x => x.ArhivaId,
                        principalTable: "Arhive",
                        principalColumn: "ArhivaId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ArhiveStanja_Arhive_ArhivaId1",
                        column: x => x.ArhivaId1,
                        principalTable: "Arhive",
                        principalColumn: "ArhivaId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ArhiveStanja_Artikli_ArtiklId",
                        column: x => x.ArtiklId,
                        principalTable: "Artikli",
                        principalColumn: "ArtiklId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ArhiveStanja_Artikli_ArtiklId1",
                        column: x => x.ArtiklId1,
                        principalTable: "Artikli",
                        principalColumn: "ArtiklId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ArhiveStanja_ArhivaId",
                table: "ArhiveStanja",
                column: "ArhivaId");

            migrationBuilder.CreateIndex(
                name: "IX_ArhiveStanja_ArhivaId1",
                table: "ArhiveStanja",
                column: "ArhivaId1");

            migrationBuilder.CreateIndex(
                name: "IX_ArhiveStanja_ArtiklId",
                table: "ArhiveStanja",
                column: "ArtiklId");

            migrationBuilder.CreateIndex(
                name: "IX_ArhiveStanja_ArtiklId1",
                table: "ArhiveStanja",
                column: "ArtiklId1");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ArhiveStanja");

            migrationBuilder.DropTable(
                name: "Arhive");
        }
    }
}
