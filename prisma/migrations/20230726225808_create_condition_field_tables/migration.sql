-- AlterEnum
ALTER TYPE "FieldType" ADD VALUE 'CONDITION';

-- CreateTable
CREATE TABLE "FieldCondition" (
    "id" SERIAL NOT NULL,
    "field_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FieldCondition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldConditionBranch" (
    "id" SERIAL NOT NULL,
    "field_condition_id" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FieldConditionBranch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldConditionBranchesOnFields" (
    "field_condition_branch_id" INTEGER NOT NULL,
    "field_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FieldConditionBranchesOnFields_pkey" PRIMARY KEY ("field_condition_branch_id","field_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FieldCondition_field_id_key" ON "FieldCondition"("field_id");

-- AddForeignKey
ALTER TABLE "FieldCondition" ADD CONSTRAINT "FieldCondition_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldConditionBranch" ADD CONSTRAINT "FieldConditionBranch_field_condition_id_fkey" FOREIGN KEY ("field_condition_id") REFERENCES "FieldCondition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldConditionBranchesOnFields" ADD CONSTRAINT "FieldConditionBranchesOnFields_field_condition_branch_id_fkey" FOREIGN KEY ("field_condition_branch_id") REFERENCES "FieldConditionBranch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldConditionBranchesOnFields" ADD CONSTRAINT "FieldConditionBranchesOnFields_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "Field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
