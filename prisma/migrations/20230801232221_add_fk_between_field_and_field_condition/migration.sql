-- AlterTable
ALTER TABLE "Field" ADD COLUMN     "parent_field_condition_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Field" ADD CONSTRAINT "Field_parent_field_condition_id_fkey" FOREIGN KEY ("parent_field_condition_id") REFERENCES "FieldCondition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
