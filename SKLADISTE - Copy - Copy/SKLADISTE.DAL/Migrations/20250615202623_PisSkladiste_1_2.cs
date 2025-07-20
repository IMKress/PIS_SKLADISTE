using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SKLADISTE.DAL.Migrations
{
    public partial class PisSkladiste_1_2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "KategorijaNaziv2",
                table: "Kategorije",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "StatusiTipova",
                columns: table => new
                {
                    StatusId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StatusNaziv = table.Column<string>(maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StatusiTipova", x => x.StatusId);
                });

            migrationBuilder.CreateTable(
                name: "StatusiDokumenata",
                columns: table => new
                {
                    DokumentId = table.Column<int>(nullable: false),
                    StatusId = table.Column<int>(nullable: false),
                    Datum = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StatusiDokumenata", x => new { x.DokumentId, x.StatusId });
                    table.ForeignKey(
                        name: "FK_StatusiDokumenata_Dokumenti_DokumentId",
                        column: x => x.DokumentId,
                        principalTable: "Dokumenti",
                        principalColumn: "DokumentId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StatusiDokumenata_StatusiTipova_StatusId",
                        column: x => x.StatusId,
                        principalTable: "StatusiTipova",
                        principalColumn: "StatusId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StatusiDokumenata_StatusId",
                table: "StatusiDokumenata",
                column: "StatusId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StatusiDokumenata");

            migrationBuilder.DropTable(
                name: "StatusiTipova");

            migrationBuilder.DropColumn(
                name: "KategorijaNaziv2",
                table: "Kategorije");
        }
    }
}
