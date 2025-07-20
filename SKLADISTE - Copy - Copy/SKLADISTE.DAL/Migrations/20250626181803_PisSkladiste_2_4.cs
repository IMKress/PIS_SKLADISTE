using Microsoft.EntityFrameworkCore.Migrations;

namespace SKLADISTE.DAL.Migrations
{
    public partial class PisSkladiste_2_4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_PrimNaruVeze",
                table: "PrimNaruVeze");

            migrationBuilder.AddColumn<int>(
                name: "PmvId",
                table: "PrimNaruVeze",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PrimNaruVeze",
                table: "PrimNaruVeze",
                column: "PmvId");

            migrationBuilder.CreateIndex(
                name: "IX_PrimNaruVeze_NarudzbenicaId",
                table: "PrimNaruVeze",
                column: "NarudzbenicaId");

            migrationBuilder.CreateIndex(
                name: "IX_PrimNaruVeze_PrimkaId",
                table: "PrimNaruVeze",
                column: "PrimkaId");

            migrationBuilder.CreateIndex(
                name: "IX_NarudzbenicaDetalji_NP_Id",
                table: "NarudzbenicaDetalji",
                column: "NP_Id");

            migrationBuilder.AddForeignKey(
                name: "FK_NarudzbenicaDetalji_NaciniPlacanja_NP_Id",
                table: "NarudzbenicaDetalji",
                column: "NP_Id",
                principalTable: "NaciniPlacanja",
                principalColumn: "NP_Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PrimNaruVeze_Dokumenti_NarudzbenicaId",
                table: "PrimNaruVeze",
                column: "NarudzbenicaId",
                principalTable: "Dokumenti",
                principalColumn: "DokumentId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PrimNaruVeze_Dokumenti_PrimkaId",
                table: "PrimNaruVeze",
                column: "PrimkaId",
                principalTable: "Dokumenti",
                principalColumn: "DokumentId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NarudzbenicaDetalji_NaciniPlacanja_NP_Id",
                table: "NarudzbenicaDetalji");

            migrationBuilder.DropForeignKey(
                name: "FK_PrimNaruVeze_Dokumenti_NarudzbenicaId",
                table: "PrimNaruVeze");

            migrationBuilder.DropForeignKey(
                name: "FK_PrimNaruVeze_Dokumenti_PrimkaId",
                table: "PrimNaruVeze");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PrimNaruVeze",
                table: "PrimNaruVeze");

            migrationBuilder.DropIndex(
                name: "IX_PrimNaruVeze_NarudzbenicaId",
                table: "PrimNaruVeze");

            migrationBuilder.DropIndex(
                name: "IX_PrimNaruVeze_PrimkaId",
                table: "PrimNaruVeze");

            migrationBuilder.DropIndex(
                name: "IX_NarudzbenicaDetalji_NP_Id",
                table: "NarudzbenicaDetalji");

            migrationBuilder.DropColumn(
                name: "PmvId",
                table: "PrimNaruVeze");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PrimNaruVeze",
                table: "PrimNaruVeze",
                columns: new[] { "PrimkaId", "NarudzbenicaId" });
        }
    }
}
