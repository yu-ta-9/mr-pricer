-- DropForeignKey
ALTER TABLE "FieldConditionBranchesOnFields" DROP CONSTRAINT "FieldConditionBranchesOnFields_field_condition_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "FieldConditionBranchesOnFields" DROP CONSTRAINT "FieldConditionBranchesOnFields_field_id_fkey";

-- AddForeignKey
ALTER TABLE "FieldConditionBranchesOnFields" ADD CONSTRAINT "FieldConditionBranchesOnFields_field_condition_branch_id_fkey" FOREIGN KEY ("field_condition_branch_id") REFERENCES "FieldConditionBranch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldConditionBranchesOnFields" ADD CONSTRAINT "FieldConditionBranchesOnFields_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;
