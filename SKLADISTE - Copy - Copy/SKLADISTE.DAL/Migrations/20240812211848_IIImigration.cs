using Microsoft.EntityFrameworkCore.Migrations;

namespace SKLADISTE.DAL.Migrations
{
    public partial class IIImigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TipDokumentaNaziv",
                table: "Dokumenti");

            migrationBuilder.AlterColumn<int>(
                name: "TipDokumentaId",
                table: "Dokumenti",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(10)",
                oldMaxLength: 10);

            migrationBuilder.CreateTable(
                name: "DokumentTipovi",
                columns: table => new
                {
                    TipDokumentaId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TipDokumenta = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DokumentTipovi", x => x.TipDokumentaId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Dokumenti_TipDokumentaId",
                table: "Dokumenti",
                column: "TipDokumentaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Dokumenti_DokumentTipovi_TipDokumentaId",
                table: "Dokumenti",
                column: "TipDokumentaId",
                principalTable: "DokumentTipovi",
                principalColumn: "TipDokumentaId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Dokumenti_DokumentTipovi_TipDokumentaId",
                table: "Dokumenti");

            migrationBuilder.DropTable(
                name: "DokumentTipovi");

            migrationBuilder.DropIndex(
                name: "IX_Dokumenti_TipDokumentaId",
                table: "Dokumenti");

            migrationBuilder.AlterColumn<string>(
                name: "TipDokumentaId",
                table: "Dokumenti",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: false,
                oldClrType: typeof(int));

            migrationBuilder.AddColumn<string>(
                name: "TipDokumentaNaziv",
                table: "Dokumenti",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");
        }
    }
}
