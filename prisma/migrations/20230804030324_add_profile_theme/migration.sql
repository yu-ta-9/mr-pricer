-- CreateTable
CREATE TABLE "ProfileTheme" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "primary_color" TEXT NOT NULL,
    "form_background_color" TEXT NOT NULL,
    "content_background_color" TEXT NOT NULL,
    "text_color" TEXT NOT NULL,
    "border_color" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfileTheme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfileTheme_profile_id_key" ON "ProfileTheme"("profile_id");

-- AddForeignKey
ALTER TABLE "ProfileTheme" ADD CONSTRAINT "ProfileTheme_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
